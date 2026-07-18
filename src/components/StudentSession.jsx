import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, Users, ArrowRight, Hourglass, CheckCircle2, 
  AlertCircle, ChevronUp, ChevronDown, Check, Play, CornerDownRight
} from 'lucide-react';
import mqttService from '../utils/mqtt';

export default function StudentSession({ roomCode, onLeave }) {
  const [nickname, setNickname] = useState(() => localStorage.getItem('nickpocket_student_name') || '');
  const [isJoined, setIsJoined] = useState(false);
  const [connStatus, setConnStatus] = useState('disconnected');
  const [connError, setConnError] = useState('');

  // Active question state from teacher
  const [roomState, setRoomState] = useState('waiting'); // 'waiting', 'answering', 'stopped', 'finished'
  const [activeQuestion, setActiveQuestion] = useState(null);
  
  // Student answer states
  const [selectedOption, setSelectedOption] = useState(null);
  const [orderingItems, setOrderingItems] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [submitTime, setSubmitTime] = useState(null);

  // Time tracker for game timer display
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStartMs, setQuestionStartMs] = useState(0);

  // Handle local storage nickname update
  const handleJoin = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    localStorage.setItem('nickpocket_student_name', nickname.trim());
    setIsJoined(true);
  };

  // 1. MQTT lifecycle for student connection
  useEffect(() => {
    if (!isJoined) return;

    mqttService.connect(
      roomCode,
      'student',
      handleBrokerMessage,
      handleStatusChange
    );

    // Alert room of join presence
    setTimeout(() => {
      mqttService.publishResponse({ event: 'join', studentName: nickname });
    }, 1500);

    return () => {
      mqttService.disconnect();
    };
  }, [isJoined, roomCode, nickname]);

  const handleStatusChange = (status, info) => {
    setConnStatus(status);
    if (status === 'error') {
      setConnError(info || 'Connection failed');
    }
  };

  // 2. State dispatcher based on teacher broadcasts
  const handleBrokerMessage = (topic, payload) => {
    console.log('[Student] Broker message received:', payload);
    
    if (payload.event === 'lobby') {
      setRoomState('waiting');
      setActiveQuestion(null);
      setHasSubmitted(false);
      setSelectedOption(null);
      setOrderingItems([]);
    } 
    else if (payload.event === 'question_start') {
      setRoomState('answering');
      setHasSubmitted(false);
      setSelectedOption(null);
      setSubmitting(false);
      setSubmitTime(null);
      setQuestionStartMs(Date.now());
      
      const qData = {
        type: payload.type,
        index: payload.questionIndex,
        questionText: payload.questionText,
        options: payload.options || [],
        items: payload.items || [],
        timeLimit: payload.timeLimit || 0
      };
      
      setActiveQuestion(qData);
      
      if (payload.type === 'ordering') {
        // Shuffle items for the student to sort
        const shuffled = [...payload.items].sort(() => Math.random() - 0.5);
        setOrderingItems(shuffled);
      }
      
      if (payload.timeLimit) {
        setTimeLeft(payload.timeLimit);
      }
    } 
    else if (payload.event === 'question_stop') {
      setRoomState('stopped');
    }
    else if (payload.event === 'next_question_waiting') {
      setRoomState('waiting');
      setActiveQuestion(null);
      setHasSubmitted(false);
      setSelectedOption(null);
      setOrderingItems([]);
    }
    else if (payload.event === 'session_finished') {
      setRoomState('finished');
      setActiveQuestion(null);
    }
  };

  // Countdown timer local tick
  useEffect(() => {
    if (roomState !== 'answering' || !activeQuestion || activeQuestion.timeLimit <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [roomState, activeQuestion]);

  // 3. Option choice submission
  const selectOptionValue = (letter) => {
    if (hasSubmitted || roomState !== 'answering') return;
    setSelectedOption(letter);
  };

  const submitChoiceValue = () => {
    if (hasSubmitted || roomState !== 'answering' || !selectedOption) return;
    setSubmitting(true);
    const now = Date.now();
    setSubmitTime(now);

    try {
      const success = mqttService.publishResponse({
        event: 'submit_answer',
        studentName: nickname,
        answer: selectedOption,
        timestamp: now,
        questionIndex: activeQuestion.index
      });

      if (success) {
        setHasSubmitted(true);
      } else {
        alert('Failed to send answer. Check your connection.');
      }
    } catch (e) {
      console.error('[MQTT] Publish error:', e);
      alert('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Ordering submission helpers
  const moveOrderItem = (index, dir) => {
    if (hasSubmitted || roomState !== 'answering') return;
    const targetIdx = dir === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= orderingItems.length) return;
    
    const nextArr = [...orderingItems];
    const temp = nextArr[index];
    nextArr[index] = nextArr[targetIdx];
    nextArr[targetIdx] = temp;
    setOrderingItems(nextArr);
  };

  // HTML5 Drag and Drop for Ordering (Desktop browser simulator)
  const handleDragStart = (e, index) => {
    if (hasSubmitted || roomState !== 'answering') return;
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (e, targetIdx) => {
    if (hasSubmitted || roomState !== 'answering') return;
    const sourceIdx = parseInt(e.dataTransfer.getData('text/plain'));
    if (isNaN(sourceIdx) || sourceIdx === targetIdx) return;
    
    const nextArr = [...orderingItems];
    const draggedItem = nextArr[sourceIdx];
    nextArr.splice(sourceIdx, 1);
    nextArr.splice(targetIdx, 0, draggedItem);
    setOrderingItems(nextArr);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const submitOrderValue = () => {
    if (hasSubmitted || roomState !== 'answering') return;
    setSubmitting(true);
    const now = Date.now();
    setSubmitTime(now);

    const success = mqttService.publishResponse({
      event: 'submit_answer',
      studentName: nickname,
      answer: orderingItems,
      timestamp: now,
      questionIndex: activeQuestion.index
    });

    if (success) {
      setHasSubmitted(true);
      setSubmitting(false);
    } else {
      setSubmitting(false);
      alert('Failed to send sorting order. Check your connection.');
    }
  };

  // Calculate elapsed response time
  const getElapsedSeconds = () => {
    if (!submitTime) return null;
    return ((submitTime - questionStartMs) / 1000).toFixed(2);
  };

  // --- RENDERS ---

  // Nickname entry screen
  if (!isJoined) {
    return (
      <div className="mobile-container animate-slide-up flex-center" style={{ minHeight: '85vh' }}>
        <form onSubmit={handleJoin} className="glass-card" style={{ width: '100%', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>Student Portal</span>
            <h1 className="text-gradient" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Join Room</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Enter a nickname to participate</p>
          </div>

          <div className="form-group">
            <label className="form-label">Room Code</label>
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', textAlign: 'center', border: '1px dashed var(--border-glow)' }}>
              <strong style={{ fontSize: '1.4rem', color: 'var(--color-indigo)', letterSpacing: '1px' }}>{roomCode}</strong>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Nickname</label>
            <input 
              type="text" 
              className="input-field" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              placeholder="e.g. CodeRider" 
              maxLength={15}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }} disabled={!nickname.trim()}>
            Join Lobby <ArrowRight size={18} />
          </button>
        </form>

        <footer className="footer-branding" style={{ marginTop: '2rem', width: '100%' }}>
          designed by <span>Nien-Lin Hsueh, Feng Chia University</span>
        </footer>
      </div>
    );
  }

  // Active student room dashboard
  return (
    <div className="mobile-container animate-slide-up" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      
      {/* Mobile top status bar */}
      <div className="flex-between glass-card animate-pulse-glow" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {connStatus === 'connected' ? (
            <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
              <Wifi size={14} /> Active
            </span>
          ) : (
            <span style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }} title={connError}>
              <WifiOff size={14} /> Reconnecting
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Room: <strong style={{ color: 'var(--text-primary)' }}>{roomCode}</strong> • Nick: <strong style={{ color: 'var(--color-indigo)' }}>{nickname}</strong>
        </div>
      </div>

      {/* RENDER BASED ON ROOM STATE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* LOBBY / WAITING SCREEN */}
        {roomState === 'waiting' && (
          <div className="glass-card flex-center animate-pop" style={{ flex: 1, flexDirection: 'column', textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div className="animate-float" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>You're In, {nickname}!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px' }}>
              Wait here. The questions will appear on this screen once the teacher clicks start on the projector.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem', alignItems: 'center', color: 'var(--text-muted)' }}>
              <Hourglass size={16} className="animate-spin" />
              <span style={{ fontSize: '0.85rem' }}>Waiting for teacher...</span>
            </div>
          </div>
        )}

        {/* ANSWERING SCREEN */}
        {roomState === 'answering' && activeQuestion && (
          <div className="glass-card animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
            <div>
              {/* Question Header */}
              <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <span className="badge badge-indigo">Active Question</span>
                {activeQuestion.timeLimit > 0 && (
                  <span className="badge badge-warning" style={{ fontSize: '0.9rem' }}>
                    <Hourglass size={14} className="animate-spin" /> {timeLeft}s
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h2 style={{ fontSize: '1.25rem', lineHeight: '1.4', marginBottom: '1.5rem', fontWeight: 600 }}>
                {activeQuestion.questionText}
              </h2>

              {/* Options display */}
              {hasSubmitted ? (
                /* Post-Submission Screen */
                <div className="flex-center" style={{ flexDirection: 'column', padding: '3rem 0', textAlign: 'center' }}>
                  <CheckCircle2 size={56} style={{ color: 'var(--color-success)', marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Answer Submitted!</h3>
                  {elapsedTime || getElapsedSeconds() ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Speed: {elapsedTime || getElapsedSeconds()} seconds
                    </p>
                  ) : null}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1rem' }}>
                    Look at the projector screen. Results will be shown once answering stops.
                  </p>
                </div>
              ) : activeQuestion.type === 'ordering' ? (
                /* Ordering Sorting UI */
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Arrange items by dragging or tapping arrows, then submit:
                  </p>
                  <div style={{ marginBottom: '1.5rem' }}>
                    {orderingItems.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="sortable-item"
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx)}
                        style={{ padding: '0.75rem 1rem' }}
                      >
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{idx + 1}</span>
                          <span style={{ fontSize: '0.95rem' }}>{item}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-icon" 
                            style={{ padding: '0.25rem' }} 
                            onClick={() => moveOrderItem(idx, 'up')}
                            disabled={idx === 0}
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-icon" 
                            style={{ padding: '0.25rem' }} 
                            onClick={() => moveOrderItem(idx, 'down')}
                            disabled={idx === orderingItems.length - 1}
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '1rem' }} 
                    onClick={submitOrderValue}
                    disabled={submitting}
                  >
                    Submit Order <CornerDownRight size={18} />
                  </button>
                </div>
              ) : (
                /* Standard Multiple Choice Buttons (A, B, C, D) */
                <div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                     {activeQuestion.options.map((opt, idx) => {
                       const letters = ['A', 'B', 'C', 'D'];
                       const isSelected = selectedOption === letters[idx];
                       return (
                         <button 
                           key={idx}
                           type="button"
                           className={`option-btn ${isSelected ? 'selected' : ''}`}
                           onClick={() => selectOptionValue(letters[idx])}
                           disabled={submitting}
                         >
                           <span className="option-letter">{letters[idx]}</span>
                           <span style={{ fontSize: '1rem' }}>{opt}</span>
                         </button>
                       );
                     })}
                   </div>

                   <button
                     type="button"
                     className="btn btn-primary"
                     style={{ width: '100%', padding: '1rem' }}
                     onClick={submitChoiceValue}
                     disabled={submitting || !selectedOption}
                   >
                     Submit Answer <CornerDownRight size={18} />
                   </button>
                 </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {activeQuestion.type === 'game' ? '⚠️ Speed scoring enabled! Answer quickly.' : 'Review your selection before closing.'}
              </span>
            </div>
          </div>
        )}

        {/* STOPPED / WAITING RESULTS STATE */}
        {roomState === 'stopped' && (
          <div className="glass-card flex-center animate-pop" style={{ flex: 1, flexDirection: 'column', textAlign: 'center', padding: '3rem 1.5rem' }}>
            <CheckCircle2 size={64} style={{ color: 'var(--color-success)', marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Time's Up / Stopped</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px' }}>
              The teacher has closed this question. Look at the front board to check correct answers and stats!
            </p>
            <div className="badge badge-indigo" style={{ marginTop: '2rem' }}>
              Waiting for next question...
            </div>
          </div>
        )}

        {/* FINISHED SESSION STATE */}
        {roomState === 'finished' && (
          <div className="glass-card flex-center animate-pop" style={{ flex: 1, flexDirection: 'column', textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🎓</div>
            <h1 className="text-gradient" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Activity Finished</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '280px', marginBottom: '2rem' }}>
              Congratulations on completing the interactive quiz/game! Thank you for participating.
            </p>
            <button className="btn btn-secondary" onClick={onLeave} style={{ width: '100%', padding: '1rem' }}>
              Exit Room
            </button>
          </div>
        )}

      </div>

      {/* Mobile Branding Footer */}
      <footer className="footer-branding" style={{ marginTop: '2.5rem' }}>
        designed by <span>Nien-Lin Hsueh, Feng Chia University</span>
      </footer>
    </div>
  );
}
