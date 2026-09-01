import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Play, Square, ChevronRight, ArrowLeft, Users, Wifi, WifiOff, 
  CheckCircle, AlertCircle, Award, Hourglass, RefreshCw, BarChart2, Star
} from 'lucide-react';
import mqttService from '../utils/mqtt';

export default function TeacherSession({ activity, roomCode, onBack }) {
  const formatTime = (secs) => {
    const s = Math.max(0, Math.floor(secs));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [connectionError, setConnectionError] = useState('');
  const [joinedStudents, setJoinedStudents] = useState([]);
  
  // Running state
  const [sessionStatus, setSessionStatus] = useState('lobby'); // 'lobby', 'active', 'results', 'finished'
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { studentName: { answer, timestamp, questionIndex } }
  
  // Game scores state
  const [studentScores, setStudentScores] = useState({}); // { studentName: score }
  
  // View mode for short answers
  const [shortAnswerViewMode, setShortAnswerViewMode] = useState('grid'); // 'grid' or 'danmaku'
  
  // Lobby idle timeout (5 minutes = 300 seconds)
  const [lobbyTimeLeft, setLobbyTimeLeft] = useState(300);
  const lobbyTimerRef = useRef(null);
  const lobbyTimeLeftRef = useRef(300);
  lobbyTimeLeftRef.current = lobbyTimeLeft;

  // Question answering countdown timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const timerRef = useRef(null);

  // Synchronized refs to prevent stale closure in MQTT callback
  const sessionStatusRef = useRef(sessionStatus);
  sessionStatusRef.current = sessionStatus;

  const currentQIndexRef = useRef(currentQIndex);
  currentQIndexRef.current = currentQIndex;

  const activityRef = useRef(activity);
  activityRef.current = activity;

  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  
  const currentQuestion = activity.questions[currentQIndex];
  const studentUrl = `${window.location.origin}${window.location.pathname}#/student/${roomCode}`;


  // Lobby countdown timer (auto-close after 5 min of inactivity)
  useEffect(() => {
    if (sessionStatus === 'lobby') {
      if (lobbyTimerRef.current) clearInterval(lobbyTimerRef.current);
      lobbyTimerRef.current = setInterval(() => {
        setLobbyTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(lobbyTimerRef.current);
            broadcastState({ event: 'session_timeout', reason: 'lobby_timeout' });
            alert('大廳等待超過 5 分鐘未啟動，已自動關閉房間。');
            onBack();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (lobbyTimerRef.current) clearInterval(lobbyTimerRef.current);
    }

    return () => {
      if (lobbyTimerRef.current) clearInterval(lobbyTimerRef.current);
    };
  }, [sessionStatus]);

  // 1. MQTT Connection Lifecycle
  useEffect(() => {
    mqttService.connect(
      roomCode,
      'teacher',
      handleIncomingMessage,
      handleStatusChange
    );

    return () => {
      mqttService.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roomCode]);

  // Status handler
  const handleStatusChange = (status, info) => {
    setConnectionStatus(status);
    if (status === 'connected') {
      broadcastState({ event: 'lobby', activityTitle: activity.title, activityType: 'chapter' });
    }
    if (status === 'error') {
      setConnectionError(info || 'Real-time broker error');
    }
  };

  // Broadcast state helper
  const broadcastState = (stateObj) => {
    mqttService.publishState(stateObj);
  };

  // Broadcast real-time stats to students
  const broadcastCurrentStats = (nextAnswers) => {
    const qIndex = currentQIndexRef.current;
    const act = activityRef.current;
    if (!act || !act.questions) return;
    const q = act.questions[qIndex];
    if (!q) return;

    const stats = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    let total = 0;
    const shortList = [];

    const ansMap = nextAnswers || answers;
    Object.keys(ansMap).forEach(stName => {
      const item = ansMap[stName];
      if (item && item.questionIndex === qIndex && item.answer !== undefined) {
        if (stats[item.answer] !== undefined) {
          stats[item.answer]++;
        }
        total++;
        if (q.type === 'short') {
          shortList.push({ studentName: stName, text: item.answer, timestamp: item.timestamp });
        }
      }
    });

    broadcastState({
      event: 'stats_update',
      questionIndex: qIndex,
      stats,
      totalSubmissions: total,
      totalStudents: joinedStudents.length,
      shortAnswers: shortList,
      correctAnswer: sessionStatusRef.current === 'results' ? q.correctAnswer : null
    });
  };

  // 2. Message Dispatcher
  const handleIncomingMessage = (topic, payload) => {
    if (payload.event === 'join') {
      setJoinedStudents(prev => {
        if (prev.includes(payload.studentName)) return prev;
        return [...prev, payload.studentName];
      });
      // Acknowledge join and tell student the current room status
      broadcastLobbyState();
    } 
    else if (payload.event === 'submit_answer') {
      setAnswers(prev => {
        const next = {
          ...prev,
          [payload.studentName]: {
            answer: payload.answer,
            timestamp: payload.timestamp,
            questionIndex: payload.questionIndex
          }
        };
        broadcastCurrentStats(next);
        return next;
      });
    }
  };

  const broadcastLobbyState = () => {
    const status = sessionStatusRef.current;
    const qIndex = currentQIndexRef.current;
    if (status === 'lobby') {
      broadcastState({ event: 'lobby', acknowledged: true, activityTitle: activityRef.current.title });
    } else if (status === 'active') {
      broadcastActiveQuestion(qIndex);
      broadcastCurrentStats();
    } else if (status === 'stopped' || status === 'results') {
      const q = activityRef.current.questions[qIndex];
      const statsObj = getMultipleChoiceStats();
      broadcastState({ 
        event: 'question_stop', 
        questionIndex: qIndex,
        correctAnswer: q ? q.correctAnswer : null,
        stats: statsObj.stats,
        totalSubmissions: statsObj.total,
        totalStudents: joinedStudents.length,
        shortAnswers: getShortAnswers()
      });
    } else if (status === 'finished') {
      broadcastState({ event: 'session_finished' });
    }
  };

  // 3. Question Flow Controls
  const startQuestion = () => {
    if (lobbyTimerRef.current) clearInterval(lobbyTimerRef.current);
    setAnswers({});
    setSessionStatus('active');
    setQuestionStartTime(Date.now());

    // Determine duration: custom timeLimit or smart defaults (ccq: 90s, poll: 60s, ordering/short: 180s, game: 20s)
    const q = activity.questions[currentQIndex];
    let duration = q.timeLimit;
    if (!duration || duration <= 0) {
      if (q.type === 'ccq') duration = 90;
      else if (q.type === 'poll') duration = 60;
      else if (q.type === 'ordering') duration = 180;
      else if (q.type === 'short') duration = 180;
      else if (q.type === 'game') duration = 20;
      else duration = 90;
    }

    setTimeLeft(duration);
    timeLeftRef.current = duration;

    // Broadcast active question with calculated duration to students
    broadcastActiveQuestion(currentQIndex, duration);

    // Start answering countdown timer with auto-stop
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          stopQuestion(); // Auto-stop when time is up!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const extendTime = (addSecs = 30) => {
    setTimeLeft(prev => {
      const next = prev + addSecs;
      timeLeftRef.current = next;
      broadcastState({ event: 'timer_extend', addSeconds: addSecs, timeLeft: next });
      return next;
    });
  };

  const broadcastActiveQuestion = (idx, explicitDuration) => {
    const act = activityRef.current;
    const q = act.questions[idx];
    if (!q) return;

    let duration = explicitDuration || timeLeftRef.current;
    if (!duration || duration <= 0) {
      if (q.type === 'ccq') duration = 90;
      else if (q.type === 'poll') duration = 60;
      else if (q.type === 'ordering') duration = 180;
      else if (q.type === 'short') duration = 180;
      else if (q.type === 'game') duration = 20;
      else duration = 90;
    }

    if (q.type === 'ordering') {
      broadcastState({
        event: 'question_start',
        type: 'ordering',
        questionIndex: idx,
        questionText: q.questionText,
        items: q.items,
        timeLimit: duration
      });
    } else {
      broadcastState({
        event: 'question_start',
        type: q.type,
        questionIndex: idx,
        questionText: q.questionText,
        options: q.options,
        timeLimit: duration
      });
    }
  };

  const stopQuestion = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSessionStatus('results');

    const q = activity.questions[currentQIndex];
    const statsObj = getMultipleChoiceStats();
    broadcastState({ 
      event: 'question_stop', 
      questionIndex: currentQIndex,
      correctAnswer: q ? q.correctAnswer : null,
      stats: statsObj.stats,
      totalSubmissions: statsObj.total,
      totalStudents: joinedStudents.length,
      shortAnswers: getShortAnswers()
    });

    // Calculate game scores if type is Game
    if (currentQuestion.type === 'game') {
      calculateGameScores();
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < activity.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSessionStatus('lobby'); // Go back to lobbying / ready state for next question
      setAnswers({});
      setShortAnswerViewMode('grid');
      // Alert students that we are moving to next question
      broadcastState({ event: 'next_question_waiting', questionIndex: currentQIndex + 1 });
    } else {
      setSessionStatus('finished');
      broadcastState({ event: 'session_finished' });
    }
  };

  // 4. Game Score calculations
  const calculateGameScores = () => {
    const q = activity.questions[currentQIndex];
    const newScores = { ...studentScores };

    Object.keys(answers).forEach((studentName) => {
      const response = answers[studentName];
      // Check correct
      if (response && response.answer === q.correctAnswer) {
        // Correct! Calculate score based on speed
        const timeLimitMs = (q.timeLimit || 15) * 1000;
        const elapsed = Math.max(0, response.timestamp - questionStartTime);
        
        // Base score 500, up to 1000 total depending on speed
        let questionScore = 500;
        if (timeLimitMs > 0) {
          const ratio = Math.max(0, Math.min(1, elapsed / timeLimitMs));
          questionScore += Math.round(500 * (1 - ratio));
        } else {
          questionScore = 1000;
        }

        newScores[studentName] = (newScores[studentName] || 0) + questionScore;
      } else {
        // Incorrect or no response
        newScores[studentName] = newScores[studentName] || 0;
      }
    });

    // Make sure all joined students are in the scores object even if they didn't answer
    joinedStudents.forEach(student => {
      if (!(student in newScores)) {
        newScores[student] = 0;
      }
    });

    setStudentScores(newScores);
  };

  // 5. Result Computations & Visuals
  
  // Calculate stats for CCQ/Poll (A, B, C, D votes)
  const getMultipleChoiceStats = () => {
    const stats = { A: 0, B: 0, C: 0, D: 0 };
    let total = 0;

    Object.values(answers).forEach((ans) => {
      if (ans.questionIndex === currentQIndex && stats[ans.answer] !== undefined) {
        stats[ans.answer]++;
        total++;
      }
    });

    return { stats, total };
  };

  // Extract all short answer responses
  const getShortAnswers = () => {
    const list = [];
    Object.keys(answers).forEach((studentName) => {
      const ans = answers[studentName];
      if (ans.questionIndex === currentQIndex && ans.answer) {
        list.push({
          studentName,
          text: ans.answer,
          timestamp: ans.timestamp
        });
      }
    });
    return list;
  };

  // For Ordering, check correctness and order configurations
  const getOrderingStats = () => {
    const correctSeq = currentQuestion.items;
    let correctCount = 0;
    let total = 0;
    const itemPositions = {}; // { "ItemText": [pos1, pos2, ...] }
    
    correctSeq.forEach(item => { itemPositions[item] = []; });

    Object.values(answers).forEach((ans) => {
      if (ans.questionIndex === currentQIndex && Array.isArray(ans.answer)) {
        total++;
        // Check exact match
        const isExact = ans.answer.every((val, index) => val === correctSeq[index]);
        if (isExact) correctCount++;

        // Store item indices for averaging
        ans.answer.forEach((itemText, idx) => {
          if (itemPositions[itemText]) {
            itemPositions[itemText].push(idx + 1);
          }
        });
      }
    });

    // Calculate averages
    const averages = {};
    correctSeq.forEach(item => {
      const positions = itemPositions[item];
      const avg = positions.length > 0 
        ? (positions.reduce((a, b) => a + b, 0) / positions.length).toFixed(1)
        : null;
      averages[item] = avg;
    });

    return { correctCount, total, averages };
  };

  // Sort overall game scoreboard
  const getSortedScoreboard = () => {
    return Object.entries(studentScores)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score);
  };

  return (
    <div className="container animate-slide-up" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
      {/* Session Header */}
      <div className="flex-between glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <button className="btn btn-secondary btn-icon" onClick={onBack} title="Leave Session">
          <ArrowLeft size={18} /> Exit
        </button>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {connectionStatus === 'connected' ? (
              <span className="badge badge-success"><Wifi size={14} /> Server Connected</span>
            ) : connectionStatus === 'connecting' ? (
              <span className="badge badge-warning"><RefreshCw size={14} className="animate-spin" /> Connecting</span>
            ) : (
              <span className="badge badge-danger" title={connectionError}><WifiOff size={14} /> Offline</span>
            )}
          </div>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginRight: '0.5rem' }}>Room Code:</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--color-indigo)', letterSpacing: '1px' }}>{roomCode}</strong>
            </div>
            
            {/* Small thumbnail QR code that expands on hover */}
            <div className="qr-thumbnail-container" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ background: 'white', padding: '2px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                <QRCodeSVG value={studentUrl} size={28} bgColor="#ffffff" fgColor="#080B11" />
              </div>
              <div className="qr-expanded-popover glass-card">
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>Scan to Join Room</p>
                <div style={{ background: 'white', padding: '8px', borderRadius: '8px', display: 'inline-block' }}>
                  <QRCodeSVG value={studentUrl} size={150} bgColor="#ffffff" fgColor="#080B11" />
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{studentUrl}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main session content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* LOBBY / SCAN TO JOIN SECTION */}
        {sessionStatus === 'lobby' && (
          <div className="grid-2" style={{ flex: 1 }}>
            {/* Left card: QR and Join Info */}
            <div className="glass-card flex-center" style={{ flexDirection: 'column', padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
                <span className="badge badge-indigo">Join the Interaction</span>
                <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Hourglass size={14} className="animate-spin" /> Lobby Timeout: <strong style={{ fontFamily: 'monospace' }}>{formatTime(lobbyTimeLeft)}</strong>
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Scan QR Code or Enter URL to Join</h2>
              
              <div className="glass-card" style={{ padding: '1rem', background: 'white', borderRadius: '16px', display: 'inline-block', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <QRCodeSVG value={studentUrl} size={180} bgColor="#ffffff" fgColor="#080B11" includeMargin={false} />
              </div>
              
              <p style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                Direct Link: <a href={studentUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-indigo)', textDecoration: 'underline' }}>{studentUrl}</a>
              </p>
              
              <div style={{ marginTop: '2rem', width: '100%' }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={startQuestion}>
                  <Play size={18} fill="white" /> Start Activity
                </button>
              </div>
            </div>

            {/* Right card: Connected Students list */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '450px' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={20} /> Students Connected ({joinedStudents.length})
                </h3>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignContent: 'flex-start' }}>
                {joinedStudents.length > 0 ? (
                  joinedStudents.map((st, i) => (
                    <span key={i} className="badge animate-pop" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem', background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                      {st}
                    </span>
                  ))
                ) : (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Users size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                    <p>Waiting for students to join...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE QUESTION PANEL (Teacher Screen) */}
        {sessionStatus === 'active' && (
          <div className="glass-card animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
            <div>
              <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span className="badge badge-indigo">Question {currentQIndex + 1} of {activity.questions.length} ({currentQuestion.type.toUpperCase()})</span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className={`badge ${timeLeft <= 15 ? "badge-danger animate-pulse-glow" : "badge-warning"}`} style={{ fontSize: '1rem', padding: '0.45rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Hourglass size={16} className="animate-spin" />
                    Time Left: <strong style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{formatTime(timeLeft)}</strong>
                  </span>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => extendTime(30)} title="Add 30 seconds to countdown">
                    +30s
                  </button>
                  <button className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={stopQuestion} title="Immediately stop answering">
                    <Square size={14} fill="white" /> Stop Answering
                  </button>
                </div>
              </div>
              
              <h1 style={{ fontSize: '2rem', lineHeight: '1.4', marginBottom: '2rem' }}>
                {currentQuestion.questionText}
              </h1>

              {/* Render Question Choices (static visual display for students/teacher screen) */}
              {currentQuestion.type !== 'ordering' && currentQuestion.type !== 'short' && currentQuestion.options && (
                <div className="grid-2" style={{ gap: '1rem' }}>
                  {currentQuestion.options.map((opt, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    return (
                      <div key={idx} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--border-light)' }}>
                        <span className="option-letter" style={{ background: 'rgba(255,255,255,0.05)' }}>{letters[idx]}</span>
                        <span style={{ fontSize: '1.1rem' }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ordering static visual list */}
              {currentQuestion.type === 'ordering' && currentQuestion.items && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '500px' }}>
                  {currentQuestion.items.map((item, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span className="badge badge-indigo" style={{ padding: '0.25rem 0.5rem' }}>Item</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-between" style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Users size={20} style={{ color: 'var(--text-secondary)' }} />
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {Object.keys(answers).length}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '0.3rem' }}>
                    out of {joinedStudents.length} students answered
                  </span>
                </div>
              </div>
              <button className="btn btn-danger" style={{ padding: '1rem 2rem' }} onClick={stopQuestion}>
                <Square size={16} fill="white" /> Stop Answering
              </button>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {sessionStatus === 'results' && (
          <div className="glass-card animate-slide-up" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-success">Answering Stopped</span>
                <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>Question Results</h2>
              </div>
              <button className="btn btn-primary" onClick={nextQuestion}>
                Next Question <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid-2" style={{ flex: 1, alignItems: 'start', gap: '2rem' }}>
              {/* Left Column: Visual Charts / Stats */}
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Live Graph</h3>
                
                {/* CCQ or Poll bar charts */}
                {(currentQuestion.type === 'ccq' || currentQuestion.type === 'poll') && (() => {
                  const { stats, total } = getMultipleChoiceStats();
                  const letters = ['A', 'B', 'C', 'D'];
                  
                  return (
                    <div>
                      {letters.map((letter, idx) => {
                        const count = stats[letter] || 0;
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        const isCorrect = currentQuestion.type === 'ccq' && currentQuestion.correctAnswer === letter;
                        
                        return (
                          <div key={letter} className="chart-bar-container">
                            <div className="chart-bar-label">
                              <span>
                                <strong>Option {letter}</strong>
                                {currentQuestion.options && currentQuestion.options[idx] && `: ${currentQuestion.options[idx]}`}
                                {isCorrect && <span style={{ color: 'var(--color-success)', marginLeft: '0.5rem' }}>(Correct Answer)</span>}
                              </span>
                              <span>{count} votes ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="chart-bar-track">
                              <div 
                                className="chart-bar-fill" 
                                style={{ 
                                  width: `${percentage}%`,
                                  background: isCorrect 
                                    ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                                    : 'linear-gradient(90deg, var(--color-indigo) 0%, var(--color-violet) 100%)'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Short Answer Stats & View Mode Toggle */}
                {currentQuestion.type === 'short' && (() => {
                  const items = getShortAnswers();
                  const colors = [
                    'linear-gradient(135deg, #fef08a 0%, #fde047 100%)', // yellow
                    'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)', // blue
                    'linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)', // green
                    'linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)', // pink
                    'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)'  // purple
                  ];

                  return (
                    <div>
                      {/* View Mode Toggle Controls */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <button 
                          className={`btn ${shortAnswerViewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                          onClick={() => setShortAnswerViewMode('grid')}
                        >
                          Grid View
                        </button>
                        <button 
                          className={`btn ${shortAnswerViewMode === 'danmaku' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                          onClick={() => setShortAnswerViewMode('danmaku')}
                        >
                          Danmaku Ticker
                        </button>
                      </div>

                      {items.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No short answers submitted.
                        </div>
                      ) : shortAnswerViewMode === 'grid' ? (
                        /* Sticky Notes Grid */
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
                          {items.map((item, idx) => {
                            const bg = colors[idx % colors.length];
                            const rotation = ((idx % 3) - 1) * 2; // -2, 0, or 2 degrees
                            return (
                              <div 
                                key={idx}
                                className="sticky-note animate-pop"
                                style={{ 
                                  background: bg,
                                  transform: `rotate(${rotation}deg)`,
                                  padding: '1.25rem',
                                  borderRadius: '8px',
                                  boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                                  minHeight: '140px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  color: '#0f172a'
                                }}
                              >
                                <p style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.4', wordBreak: 'break-word', margin: 0 }}>
                                  "{item.text}"
                                </p>
                                <div style={{ fontSize: '0.75rem', color: '#475569', textAlign: 'right', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                                  — {item.studentName}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* Danmaku Ticker View */
                        <div className="danmaku-container glass-card" style={{ height: '280px', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)' }}>
                          <div className="danmaku-track" style={{ position: 'relative', width: '100%', height: '100%' }}>
                            {items.map((item, idx) => {
                              const lane = idx % 5;
                              const topPos = 20 + lane * 48;
                              const delay = idx * 1.8;
                              const textColors = ['#fef08a', '#bfdbfe', '#bbf7d0', '#fbcfe8', '#e9d5ff'];
                              const color = textColors[idx % textColors.length];

                              return (
                                <div 
                                  key={idx}
                                  className="danmaku-item"
                                  style={{
                                    position: 'absolute',
                                    top: `${topPos}px`,
                                    whiteSpace: 'nowrap',
                                    color: color,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                    animation: `floatLeft 12s linear infinite`,
                                    animationDelay: `${delay}s`
                                  }}
                                >
                                  <strong>{item.studentName}:</strong> "{item.text}"
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Ordering Stats */}
                {currentQuestion.type === 'ordering' && (() => {
                  const { correctCount, total, averages } = getOrderingStats();
                  const pct = total > 0 ? (correctCount / total) * 100 : 0;
                  
                  return (
                    <div>
                      <div className="glass-card flex-between animate-pulse-glow" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem' }}>
                        <div>
                          <strong style={{ fontSize: '1.2rem', color: 'var(--color-success)' }}>{pct.toFixed(0)}% Correct</strong>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{correctCount} out of {total} students sorted perfectly.</p>
                        </div>
                        <Award size={36} style={{ color: 'var(--color-warning)' }} />
                      </div>

                      <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Correct Sequence:</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {currentQuestion.items.map((item, idx) => (
                          <div key={idx} className="glass-card flex-between" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.02)' }}>
                            <span><strong>{idx + 1}.</strong> {item}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {averages[item] ? `Average student rank: ${averages[item]}` : 'No submissions'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Game scoreboard for current question */}
                {currentQuestion.type === 'game' && (
                  <div>
                    <div className="glass-card flex-between" style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)', marginBottom: '1.5rem' }}>
                      <div>
                        <strong>Correct Answer: {currentQuestion.correctAnswer}</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          {currentQuestion.options[currentQuestion.correctAnswer.charCodeAt(0) - 65] || currentQuestion.options[0]}
                        </p>
                      </div>
                      <Star size={32} fill="var(--color-warning)" style={{ color: 'var(--color-warning)' }} />
                    </div>

                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Top Scores this Round:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {getSortedScoreboard().slice(0, 5).map((player, idx) => (
                        <div key={idx} className="flex-between glass-card" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.02)' }}>
                          <span><strong>#{idx + 1}</strong> {player.name}</span>
                          <strong style={{ color: 'var(--color-warning)' }}>{player.score} pts</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Individual Student Submissions */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '350px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                  Student Submissions
                </h3>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {joinedStudents.map((stName, idx) => {
                    const submission = answers[stName];
                    let statusLabel = 'No Answer';
                    let badgeClass = 'badge-danger';
                    
                    if (submission && submission.questionIndex === currentQIndex) {
                      if (currentQuestion.type === 'ccq' || currentQuestion.type === 'game') {
                        const isCorrect = submission.answer === currentQuestion.correctAnswer;
                        statusLabel = `Answered ${submission.answer} (${isCorrect ? 'Correct' : 'Incorrect'})`;
                        badgeClass = isCorrect ? 'badge-success' : 'badge-danger';
                      } else if (currentQuestion.type === 'poll') {
                        statusLabel = `Answered ${submission.answer}`;
                        badgeClass = 'badge-indigo';
                      } else if (currentQuestion.type === 'ordering') {
                        const isCorrect = Array.isArray(submission.answer) && submission.answer.every((val, index) => val === currentQuestion.items[index]);
                        statusLabel = isCorrect ? 'Sorted Correctly' : 'Sorted Incorrectly';
                        badgeClass = isCorrect ? 'badge-success' : 'badge-danger';
                      } else if (currentQuestion.type === 'short') {
                        statusLabel = submission.answer ? 'Submitted' : 'No Answer';
                        badgeClass = submission.answer ? 'badge-indigo' : 'badge-danger';
                      }
                    }

                    return (
                      <div key={idx} className="flex-between" style={{ padding: '0.25rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ fontSize: '0.9rem' }}>{stName}</span>
                        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.75rem' }}>{statusLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPLETED SESSION / GAME LEADERBOARD PODIUM */}
        {sessionStatus === 'finished' && (
          <div className="glass-card animate-slide-up flex-center" style={{ flex: 1, flexDirection: 'column', padding: '3rem', textAlign: 'center' }}>
            <span className="badge badge-success" style={{ marginBottom: '1rem' }}>Finished</span>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Activity Completed!</h1>
            
            {activity.questions.some(q => q.type === 'game') ? (
              /* Display 3D Leaderboard Podium for Games */
              <div style={{ width: '100%', maxWidth: '600px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>CS Trivia Champions:</h3>
                
                {(() => {
                  const sorted = getSortedScoreboard();
                  const gold = sorted[0];
                  const silver = sorted[1];
                  const bronze = sorted[2];

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {/* Podium Visuals */}
                      <div className="podium-container">
                        {/* 2nd place (Silver) */}
                        {silver && (
                          <div className="podium-column silver animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <span className="player-avatar">🥈</span>
                            <span className="player-name">{silver.name}</span>
                            <div className="podium-pedestal">
                              2
                              <span className="podium-score">{silver.score}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* 1st place (Gold) */}
                        {gold && (
                          <div className="podium-column gold animate-slide-up">
                            <span className="podium-crown">👑</span>
                            <span className="player-avatar">🥇</span>
                            <span className="player-name">{gold.name}</span>
                            <div className="podium-pedestal">
                              1
                              <span className="podium-score">{gold.score}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* 3rd place (Bronze) */}
                        {bronze && (
                          <div className="podium-column bronze animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <span className="player-avatar">🥉</span>
                            <span className="player-name">{bronze.name}</span>
                            <div className="podium-pedestal">
                              3
                              <span className="podium-score">{bronze.score}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Display runners up */}
                      {sorted.length > 3 && (
                        <div className="glass-card" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}>
                          <h4 style={{ textAlign: 'left', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Runners Up:</h4>
                          {sorted.slice(3, 7).map((p, index) => (
                            <div key={index} className="flex-between" style={{ padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <span><strong>#{index + 4}</strong> {p.name}</span>
                              <strong>{p.score} pts</strong>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

              </div>
            ) : (
              /* Display review for standard CCQ/Poll/Ordering */
              <div style={{ maxWidth: '500px', marginTop: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  The students have successfully completed the activities. You can exit this screen to return to your dashboard or review details.
                </p>
                <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Session Summary</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Students Connected: {joinedStudents.length}</p>
                  <p style={{ color: 'var(--text-muted)' }}>Total Questions Answered: {activity.questions.length}</p>
                </div>
              </div>
            )}

            <button className="btn btn-primary" style={{ marginTop: '2.5rem', padding: '1rem 2.5rem' }} onClick={onBack}>
              Return to Dashboard
            </button>
          </div>
        )}

      </div>

      {/* Footer Branding */}
      <footer className="footer-branding" style={{ marginTop: '3rem' }}>
        designed by <span>Nien-Lin Hsueh, Feng Chia University</span>
      </footer>
    </div>
  );
}
