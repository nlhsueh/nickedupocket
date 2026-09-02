import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, WifiOff, Hourglass, CheckCircle2, AlertCircle, 
  ChevronUp, ChevronDown, CornerDownRight, ArrowRight, BarChart2, Cloud, GripVertical, Users, MessageSquare
} from 'lucide-react';
import mqttService from '../utils/mqtt';
import FormattedMarkdown from '../utils/formatMarkdown';

export default function StudentSession({ roomCode, onLeave, activity, course, chapter }) {
  const formatTime = (secs) => {
    const s = Math.max(0, Math.floor(secs));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const targetActivity = activity;
  const activityTitle = targetActivity?.title || '';
  const firstQuestion = targetActivity?.questions?.[0];
  const questionSnippet = firstQuestion?.questionText || '';
  const questionType = firstQuestion?.type || '';

  const renderTypeBadge = (type) => {
    switch (type) {
      case 'ccq':
        return <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>❓ 觀念檢核 (CCQ)</span>;
      case 'pair':
        return <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', fontSize: '0.72rem' }}>👥 雙人討論 (Pair)</span>;
      case 'poll':
        return <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>📊 即時投票 (Poll)</span>;
      case 'game':
        return <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>⚡ 限時搶答 (Game)</span>;
      case 'wordcloud':
        return <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>☁️ 文字雲 (WordCloud)</span>;
      case 'ordering':
        return <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>🔢 流程排序 (Ordering)</span>;
      case 'short':
        return <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>📝 問答討論 (QA)</span>;
      default:
        return <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>🎯 課堂互動</span>;
    }
  };

  const [nickname, setNickname] = useState(() => localStorage.getItem('nickpocket_student_name') || '');
  const [isJoined, setIsJoined] = useState(false);
  const [connStatus, setConnStatus] = useState('disconnected');
  const [connError, setConnError] = useState('');
  
  // Track if room is active/started by the teacher
  const [roomActiveStatus, setRoomActiveStatus] = useState('checking'); // 'checking', 'active'

  // Active question state from teacher
  const [roomState, setRoomState] = useState('waiting'); // 'waiting', 'answering', 'stopped', 'finished'
  const [activeQuestion, setActiveQuestion] = useState(null);
  
  // Student answer states
  const [selectedOption, setSelectedOption] = useState(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [orderingItems, setOrderingItems] = useState([]);
  const [partnerName, setPartnerName] = useState('');
  const [pairSummary, setPairSummary] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [submitTime, setSubmitTime] = useState(null);

  // Real-time live stats received from teacher
  const [liveStats, setLiveStats] = useState({
    stats: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    totalSubmissions: 0,
    totalStudents: 0,
    shortAnswers: [],
    pairDiscussions: [],
    wordCloud: null
  });
  const [revealedCorrectAnswer, setRevealedCorrectAnswer] = useState(null);

  // Time tracker for game timer display
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStartMs, setQuestionStartMs] = useState(0);
  const [lobbyTimeLeft, setLobbyTimeLeft] = useState(300);

  // Student Nickname and Join status (managed locally)
  const handleJoin = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    localStorage.setItem('nickpocket_student_name', nickname.trim());
    setIsJoined(true);
    mqttService.publishResponse({ event: 'join', studentName: nickname.trim() });
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

    return () => {
      mqttService.disconnect();
    };
  }, [isJoined, roomCode, nickname]);

  const handleStatusChange = (status, info) => {
    setConnStatus(status);
    if (status === 'connected') {
      setRoomActiveStatus('checking');
      mqttService.publishResponse({ event: 'join', studentName: nickname });
    }
    if (status === 'error') {
      setConnError(info || 'Connection failed');
    }
  };

  // 2. State dispatcher based on teacher broadcasts
  const handleBrokerMessage = (topic, payload) => {
    console.log('[Student] Broker message received:', payload);
    
    // Mark room as active upon any valid teacher state broadcast
    const validEvents = ['lobby', 'question_start', 'question_stop', 'next_question_waiting', 'results', 'session_finished', 'stats_update'];
    if (validEvents.includes(payload.event)) {
      setRoomActiveStatus('active');
    }
    
    if (payload.event === 'lobby') {
      setRoomState('waiting');
      if (payload.lobbyTimeLeft) {
        setLobbyTimeLeft(payload.lobbyTimeLeft);
      }
      setActiveQuestion(null);
      setHasSubmitted(false);
      setSelectedOption(null);
      setTextAnswer('');
      setPartnerName('');
      setPairSummary('');
      setOrderingItems([]);
      setRevealedCorrectAnswer(null);
      setLiveStats({ stats: { A: 0, B: 0, C: 0, D: 0, E: 0 }, totalSubmissions: 0, totalStudents: 0, shortAnswers: [], pairDiscussions: [] });
      // Announce presence only if the event is not a teacher acknowledgment broadcast (prevents loops)
      if (!payload.acknowledged) {
        mqttService.publishResponse({ event: 'join', studentName: nickname });
      }
    } 
    else if (payload.event === 'question_start') {
      setRoomState('answering');
      setHasSubmitted(false);
      setSelectedOption(null);
      setTextAnswer('');
      setPartnerName('');
      setPairSummary('');
      setSubmitting(false);
      setSubmitTime(null);
      setQuestionStartMs(Date.now());
      setRevealedCorrectAnswer(null);
      setLiveStats({ stats: { A: 0, B: 0, C: 0, D: 0, E: 0 }, totalSubmissions: 0, totalStudents: 0, shortAnswers: [], pairDiscussions: [] });
      
      const qData = {
        type: payload.type,
        index: payload.questionIndex,
        questionText: payload.questionText,
        description: payload.description || '',
        options: payload.options || [],
        items: payload.items || [],
        timeLimit: payload.timeLimit || 0
      };
      
      setActiveQuestion(qData);
      
      if (payload.type === 'ordering') {
        // Shuffle items with correct number mappings and unique IDs
        const itemsWithIndex = (payload.items || []).map((item, idx) => ({
          id: `item-${idx}-${item}`,
          text: item,
          correctNum: idx + 1
        }));
        const shuffled = [...itemsWithIndex].sort(() => Math.random() - 0.5);
        setOrderingItems(shuffled);
      }
      
      if (payload.timeLimit) {
        setTimeLeft(payload.timeLimit);
      }
    } 
    else if (payload.event === 'stats_update') {
      if (activeQuestion && payload.questionIndex === activeQuestion.index) {
        setLiveStats(prev => ({
          stats: payload.stats || prev.stats,
          totalSubmissions: payload.totalSubmissions !== undefined ? payload.totalSubmissions : prev.totalSubmissions,
          totalStudents: payload.totalStudents !== undefined ? payload.totalStudents : prev.totalStudents,
          shortAnswers: payload.shortAnswers || prev.shortAnswers,
          pairDiscussions: payload.pairDiscussions || prev.pairDiscussions,
          wordCloud: payload.wordCloud || prev.wordCloud
        }));
        if (payload.correctAnswer) {
          setRevealedCorrectAnswer(payload.correctAnswer);
        }
      }
    }
    else if (payload.event === 'question_stop' || payload.event === 'results') {
      setRoomState('stopped');
      if (payload.correctAnswer) {
        setRevealedCorrectAnswer(payload.correctAnswer);
      }
      if (payload.stats || payload.wordCloud || payload.shortAnswers || payload.pairDiscussions) {
        setLiveStats(prev => ({
          ...prev,
          stats: payload.stats || prev.stats,
          totalSubmissions: payload.totalSubmissions !== undefined ? payload.totalSubmissions : prev.totalSubmissions,
          totalStudents: payload.totalStudents !== undefined ? payload.totalStudents : prev.totalStudents,
          shortAnswers: payload.shortAnswers || prev.shortAnswers,
          pairDiscussions: payload.pairDiscussions || prev.pairDiscussions,
          wordCloud: payload.wordCloud || prev.wordCloud
        }));
      }
    }
    else if (payload.event === 'next_question_waiting') {
      setRoomState('waiting');
      setActiveQuestion(null);
      setHasSubmitted(false);
      setSelectedOption(null);
      setTextAnswer('');
      setPartnerName('');
      setPairSummary('');
      setOrderingItems([]);
      setRevealedCorrectAnswer(null);
      setLiveStats({ stats: { A: 0, B: 0, C: 0, D: 0, E: 0 }, totalSubmissions: 0, totalStudents: 0, shortAnswers: [], pairDiscussions: [], wordCloud: null });
    }
    else if (payload.event === 'timer_extend') {
      setTimeLeft(prev => prev + (payload.addSeconds || 30));
    }
    else if (payload.event === 'session_timeout') {
      setRoomState('timeout');
      setActiveQuestion(null);
    }
    else if (payload.event === 'session_finished') {
      setRoomState('finished');
      setActiveQuestion(null);
    }
  };

  // Auto-submit current answer on timeout
  const autoSubmitCurrent = () => {
    if (hasSubmitted || roomState !== 'answering' || !activeQuestion) return;
    const now = Date.now();
    setSubmitTime(now);

    try {
      if (activeQuestion.type === 'ordering') {
        const orderValues = orderingItems.map(item => item.text);
        mqttService.publishResponse({
          event: 'submit_answer',
          studentName: nickname,
          answer: orderValues,
          timestamp: now,
          questionIndex: activeQuestion.index
        });
        setHasSubmitted(true);
      } else if (activeQuestion.type === 'pair') {
        if (pairSummary.trim()) {
          mqttService.publishResponse({
            event: 'submit_answer',
            studentName: nickname,
            answer: {
              summary: pairSummary.trim(),
              partnerName: partnerName.trim()
            },
            timestamp: now,
            questionIndex: activeQuestion.index
          });
          setHasSubmitted(true);
        }
      } else if ((activeQuestion.type === 'short' || activeQuestion.type === 'wordcloud')) {
        if (textAnswer.trim()) {
          mqttService.publishResponse({
            event: 'submit_answer',
            studentName: nickname,
            answer: textAnswer.trim(),
            timestamp: now,
            questionIndex: activeQuestion.index
          });
          setHasSubmitted(true);
        }
      } else {
        if (selectedOption) {
          mqttService.publishResponse({
            event: 'submit_answer',
            studentName: nickname,
            answer: selectedOption,
            timestamp: now,
            questionIndex: activeQuestion.index
          });
          setHasSubmitted(true);
        }
      }
    } catch (e) {
      console.error('[MQTT] Auto-submit error:', e);
    }
  };

  // Answering Countdown timer with auto-submit
  useEffect(() => {
    if (roomState !== 'answering' || !activeQuestion || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          autoSubmitCurrent();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [roomState, activeQuestion, timeLeft, selectedOption, textAnswer, orderingItems, hasSubmitted]);

  // Lobby countdown timer
  useEffect(() => {
    if (roomState !== 'waiting') return;
    const timer = setInterval(() => {
      setLobbyTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [roomState]);

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

  const submitTextValue = () => {
    if (hasSubmitted || roomState !== 'answering' || !textAnswer.trim()) return;
    setSubmitting(true);
    const now = Date.now();
    setSubmitTime(now);

    try {
      const success = mqttService.publishResponse({
        event: 'submit_answer',
        studentName: nickname,
        answer: textAnswer.trim(),
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

  const submitPairValue = () => {
    if (hasSubmitted || roomState !== 'answering' || !pairSummary.trim()) return;
    setSubmitting(true);
    const now = Date.now();
    setSubmitTime(now);

    try {
      const success = mqttService.publishResponse({
        event: 'submit_answer',
        studentName: nickname,
        answer: {
          summary: pairSummary.trim(),
          partnerName: partnerName.trim()
        },
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

  // 4. Ordering submission & Drag-and-Drop helpers
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const dragSourceIdxRef = useRef(null);
  const touchStartYRef = useRef(0);
  const touchItemIdxRef = useRef(null);

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

  // Desktop HTML5 Drag and Drop
  const handleDragStart = (e, index) => {
    if (hasSubmitted || roomState !== 'answering') return;
    dragSourceIdxRef.current = index;
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(index));
    } catch (err) {}
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (dragSourceIdxRef.current === null) return;
    setDragOverIdx(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDragEnd = () => {
    dragSourceIdxRef.current = null;
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (hasSubmitted || roomState !== 'answering') return;
    
    let sourceIdx = dragSourceIdxRef.current;
    if (sourceIdx === null || sourceIdx === undefined) {
      try {
        const dataStr = e.dataTransfer.getData('text/plain');
        sourceIdx = parseInt(dataStr, 10);
      } catch (err) {}
    }
    
    if (
      typeof sourceIdx === 'number' &&
      !isNaN(sourceIdx) &&
      sourceIdx !== targetIdx &&
      sourceIdx >= 0 &&
      sourceIdx < orderingItems.length
    ) {
      const nextArr = [...orderingItems];
      const [draggedItem] = nextArr.splice(sourceIdx, 1);
      nextArr.splice(targetIdx, 0, draggedItem);
      setOrderingItems(nextArr);
    }
    
    handleDragEnd();
  };

  // Mobile Touch Drag handlers
  const handleTouchStart = (e, index) => {
    if (hasSubmitted || roomState !== 'answering') return;
    touchStartYRef.current = e.touches[0].clientY;
    touchItemIdxRef.current = index;
    setDraggedIdx(index);
  };

  const handleTouchMove = (e) => {
    if (touchItemIdxRef.current === null) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const itemElement = element?.closest('[data-order-idx]');
    if (itemElement) {
      const targetIdx = parseInt(itemElement.getAttribute('data-order-idx'), 10);
      if (!isNaN(targetIdx) && targetIdx !== touchItemIdxRef.current) {
        setDragOverIdx(targetIdx);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (touchItemIdxRef.current === null) return;
    const sourceIdx = touchItemIdxRef.current;
    
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const itemElement = element?.closest('[data-order-idx]');
    
    if (itemElement) {
      const targetIdx = parseInt(itemElement.getAttribute('data-order-idx'), 10);
      if (
        !isNaN(targetIdx) &&
        targetIdx !== sourceIdx &&
        targetIdx >= 0 &&
        targetIdx < orderingItems.length
      ) {
        const nextArr = [...orderingItems];
        const [draggedItem] = nextArr.splice(sourceIdx, 1);
        nextArr.splice(targetIdx, 0, draggedItem);
        setOrderingItems(nextArr);
      }
    }
    
    touchItemIdxRef.current = null;
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const submitOrderValue = () => {
    if (hasSubmitted || roomState !== 'answering') return;
    setSubmitting(true);
    const now = Date.now();
    setSubmitTime(now);

    const success = mqttService.publishResponse({
      event: 'submit_answer',
      studentName: nickname,
      answer: orderingItems.map(item => item.text),
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

  const handleTeacherLaunch = () => {
    const password = prompt('Enter Teacher Access Password:');
    if (password === 'nlhsueh007') {
      window.location.hash = `#/teacher/${roomCode}`;
    } else if (password !== null) {
      alert('Incorrect password.');
    }
  };

  // --- RENDERS ---

  // Nickname entry screen
  if (!isJoined) {
    return (
      <div className="mobile-container animate-slide-up flex-center" style={{ minHeight: '85vh' }}>
        <form onSubmit={handleJoin} className="glass-card" style={{ width: '100%', padding: '1.75rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>Student Portal</span>
            <h1 className="text-gradient" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Join Room</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>輸入暱稱即可加入互動</p>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              題目與房間確認 (Activity Preview)
            </label>
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', border: '1px solid var(--border-glow)', borderRadius: '12px' }}>
              <div className="flex-between" style={{ marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ROOM CODE</span>
                {renderTypeBadge(questionType)}
              </div>
              <div style={{ fontSize: '1.2rem', color: 'var(--color-indigo)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '0.4rem', textAlign: 'left' }}>
                {roomCode}
              </div>

              {(activityTitle || questionSnippet) ? (
                <div style={{ textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.45rem' }}>
                  {activityTitle && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {activityTitle}
                    </div>
                  )}
                  {questionSnippet && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4', background: 'rgba(0,0,0,0.2)', padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <FormattedMarkdown text={questionSnippet} />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">你的姓名 / 暱稱 (Your Nickname)</label>
            <input 
              type="text" 
              className="input-field" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              placeholder="例如：王小明 / CodeRider" 
              maxLength={15}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.95rem', marginTop: '0.5rem', fontSize: '1rem' }} disabled={!nickname.trim()}>
            進入教室 Join Room <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={handleTeacherLaunch}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontSize: '0.75rem', 
              cursor: 'pointer', 
              textDecoration: 'underline', 
              opacity: 0.5 
            }}
            title="Launch session as teacher"
          >
            Teacher Host Launch
          </button>
        </div>

        <footer className="footer-branding" style={{ marginTop: '1.25rem', width: '100%' }}>
          designed by <span>Nien-Lin Hsueh, Feng Chia University</span>
        </footer>
      </div>
    );
  }

  // Handle room status checking and waiting
  if (roomActiveStatus === 'checking') {
    const isConnecting = connStatus === 'connecting' || connStatus === 'disconnected';
    return (
      <div className="mobile-container animate-slide-up flex-center" style={{ minHeight: '85vh', flexDirection: 'column', textAlign: 'center' }}>
        <div className="glass-card flex-center animate-pop" style={{ width: '100%', padding: '2.5rem 1.5rem', flexDirection: 'column', gap: '1.25rem' }}>
          
          {isConnecting ? (
            <Hourglass size={44} className="animate-spin" style={{ color: 'var(--color-indigo)' }} />
          ) : (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div className="animate-pulse-glow" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wifi size={30} style={{ color: 'var(--color-indigo)' }} />
              </div>
            </div>
          )}

          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: 600 }}>
              {isConnecting ? 'Connecting to Room...' : 'Waiting for Instructor'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
              {isConnecting ? (
                `Connecting to real-time server for room ${roomCode}...`
              ) : (
                <>
                  已成功連線，歡迎 <strong style={{ color: 'var(--text-primary)' }}>{nickname}</strong>！<br />
                  請等待老師在投影幕開始此題目互動。
                </>
              )}
            </p>
          </div>

          {(activityTitle || questionSnippet) ? (
            <div className="glass-card" style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-glow)', textAlign: 'left' }}>
              <div className="flex-between" style={{ marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>即將進行的題目：</span>
                {renderTypeBadge(questionType)}
              </div>
              <div style={{ fontSize: '1.1rem', color: 'var(--color-indigo)', fontWeight: 700, marginBottom: '0.3rem' }}>
                {roomCode}
              </div>
              {activityTitle && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.3rem' }}>
                  {activityTitle}
                </div>
              )}
              {questionSnippet && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4', background: 'rgba(0,0,0,0.2)', padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <FormattedMarkdown text={questionSnippet} />
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.6rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
              Room Code: <strong style={{ color: 'var(--color-indigo)' }}>{roomCode}</strong>
            </div>
          )}

          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '0.85rem' }} 
            onClick={() => {
              if (onLeave) onLeave();
              else setIsJoined(false);
            }}
          >
            Exit
          </button>

          <button 
            type="button" 
            onClick={handleTeacherLaunch}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontSize: '0.75rem', 
              cursor: 'pointer', 
              textDecoration: 'underline', 
              opacity: 0.5 
            }}
            title="Launch session as teacher"
          >
            Teacher Host Launch
          </button>

        </div>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Room: <strong style={{ color: 'var(--text-primary)' }}>{roomCode}</strong> • Nick: <strong style={{ color: 'var(--color-indigo)' }}>{nickname}</strong>
          </div>
          {onLeave && (
            <button 
              type="button" 
              onClick={onLeave}
              className="btn btn-secondary" 
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', borderRadius: '6px' }}
              title="離開房間"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* RENDER BASED ON ROOM STATE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* LOBBY / WAITING SCREEN */}
        {roomState === 'waiting' && (
          <div className="glass-card flex-center animate-pop" style={{ flex: 1, flexDirection: 'column', textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div className="animate-float" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>You're In, {nickname}!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px', marginBottom: '1.5rem' }}>
              Wait here. Questions will appear on this screen once the teacher clicks start on the projector.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Hourglass size={14} className="animate-spin" />
                Room auto-closes in: <strong style={{ fontFamily: 'monospace' }}>{formatTime(lobbyTimeLeft)}</strong>
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Waiting for instructor to start...</span>
            </div>
          </div>
        )}

        {/* ANSWERING / RESULTS SCREEN */}
        {(roomState === 'answering' || (roomState === 'stopped' && activeQuestion)) && activeQuestion && (
          <div className="glass-card animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
            <div>
              {/* Question Header */}
              <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-indigo">
                  {activeQuestion.type === 'ccq' ? 'Concept Check' : activeQuestion.type.toUpperCase()}
                </span>
                {roomState === 'answering' && timeLeft > 0 ? (
                  <span className={`badge ${timeLeft <= 15 ? 'badge-danger animate-pulse-glow' : 'badge-warning'}`} style={{ fontSize: '0.9rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Hourglass size={14} className="animate-spin" />
                    Time Left: <strong style={{ fontFamily: 'monospace' }}>{formatTime(timeLeft)}</strong>
                  </span>
                ) : roomState === 'stopped' ? (
                  <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                    🛑 作答已結束
                  </span>
                ) : null}
              </div>

              {/* Question Text */}
              <h2 className="student-question-text">
                <FormattedMarkdown text={activeQuestion.questionText} />
              </h2>

              {/* Options or Post-Submission Live Statistics Screen */}
              {hasSubmitted || roomState === 'stopped' ? (
                /* Post-Submission Screen with Live Statistics */
                <div className="animate-fade-in">
                  {/* Status Banner */}
                  <div 
                    className="glass-card flex-between" 
                    style={{ 
                      padding: '1rem 1.25rem', 
                      background: hasSubmitted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', 
                      borderColor: hasSubmitted ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)', 
                      marginBottom: '1.25rem' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {hasSubmitted ? (
                        <CheckCircle2 size={28} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      ) : (
                        <AlertCircle size={28} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                      )}
                      <div>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                          {hasSubmitted ? (roomState === 'stopped' ? '作答已結束' : '作答已送出 (Submitted!)') : '未在時間內提交'}
                        </strong>
                        {selectedOption && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            你的選擇：<strong style={{ color: 'var(--color-indigo)' }}>{selectedOption}</strong>
                            {activeQuestion.options && activeQuestion.options[selectedOption.charCodeAt(0) - 65] ? (
                              <span> - {activeQuestion.options[selectedOption.charCodeAt(0) - 65]}</span>
                            ) : null}
                          </div>
                        )}
                        {activeQuestion.type === 'pair' && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                            <div>夥伴：<strong style={{ color: 'var(--color-indigo)' }}>{partnerName.trim() || '未填寫'}</strong></div>
                            <div style={{ marginTop: '0.2rem' }}>討論結論：<strong style={{ color: 'var(--text-primary)' }}>"{pairSummary}"</strong></div>
                          </div>
                        )}
                        {textAnswer && activeQuestion.type === 'short' && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            你的回答：<strong style={{ color: 'var(--text-primary)' }}>"{textAnswer}"</strong>
                          </div>
                        )}
                        {textAnswer && activeQuestion.type === 'wordcloud' && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                            你的詞彙：
                            <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.35rem', marginLeft: '0.3rem' }}>
                              {textAnswer.split(/[,，;；、\s\n]+/).filter(t => t.trim().length > 0).map((w, i) => (
                                <span key={i} className="badge badge-indigo animate-pop" style={{ fontSize: '0.75rem', padding: '0.15rem 0.45rem' }}>
                                  ✨ {w.trim()}
                                </span>
                              ))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {(elapsedTime || getElapsedSeconds()) && hasSubmitted ? (
                      <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                        ⏱️ {elapsedTime || getElapsedSeconds()}s
                      </span>
                    ) : null}
                  </div>

                  {/* Live Statistics Section Header */}
                  <div className="flex-between" style={{ marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BarChart2 size={18} style={{ color: 'var(--color-indigo)' }} />
                      <h3 style={{ fontSize: '1.05rem', margin: 0 }}>即時作答分佈 (Live Distribution)</h3>
                    </div>
                    <span className="badge badge-indigo" style={{ fontSize: '0.8rem' }}>
                      已作答：<strong>{liveStats.totalSubmissions || (hasSubmitted ? 1 : 0)}</strong> 人
                    </span>
                  </div>

                  {/* Multiple Choice / CCQ / Poll / Game Live Chart */}
                  {(activeQuestion.type === 'ccq' || activeQuestion.type === 'poll' || activeQuestion.type === 'game') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                      {(activeQuestion.options || []).map((opt, idx) => {
                        const letter = String.fromCharCode(65 + idx);
                        const count = (liveStats.stats && liveStats.stats[letter] !== undefined)
                          ? liveStats.stats[letter]
                          : (selectedOption === letter ? 1 : 0);
                        const total = Math.max(liveStats.totalSubmissions || 0, count, 1);
                        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                        const isMyChoice = selectedOption === letter;
                        const isRevealedCorrect = revealedCorrectAnswer === letter;

                        return (
                          <div key={letter} className="chart-bar-container" style={{ margin: 0, gap: '0.35rem' }}>
                            <div className="chart-bar-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span className="option-letter" style={{ 
                                  width: '24px', 
                                  height: '24px', 
                                  fontSize: '0.8rem',
                                  background: isMyChoice ? 'var(--color-indigo)' : 'rgba(255,255,255,0.08)',
                                  color: isMyChoice ? '#fff' : 'var(--text-secondary)',
                                  border: isMyChoice ? '2px solid var(--color-indigo)' : 'none'
                                }}>
                                  {letter}
                                </span>
                                <span style={{ 
                                  fontSize: '0.9rem', 
                                  color: isRevealedCorrect ? 'var(--color-success)' : isMyChoice ? 'var(--text-primary)' : 'var(--text-secondary)', 
                                  fontWeight: isMyChoice || isRevealedCorrect ? 600 : 400 
                                }}>
                                  <FormattedMarkdown text={opt} />
                                </span>
                                {isMyChoice && (
                                  <span className="badge badge-indigo" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                                    你的選擇 🎯
                                  </span>
                                )}
                                {isRevealedCorrect && (
                                  <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                                    正確答案 ✅
                                  </span>
                                )}
                              </div>
                              <strong style={{ fontSize: '0.9rem', color: isMyChoice ? 'var(--color-indigo)' : 'var(--text-secondary)', flexShrink: 0, marginLeft: '0.5rem' }}>
                                {count} 票 ({percentage}%)
                              </strong>
                            </div>
                            <div className="chart-bar-track" style={{ height: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                              <div 
                                className="chart-bar-fill" 
                                style={{ 
                                  width: `${percentage}%`,
                                  background: isRevealedCorrect 
                                    ? 'linear-gradient(90deg, #10b981, #059669)'
                                    : isMyChoice 
                                      ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' 
                                      : 'rgba(255,255,255,0.2)'
                                }} 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Word Cloud Live Mobile Graphic */}
                  {activeQuestion.type === 'wordcloud' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div className="flex-between" style={{ marginBottom: '0.6rem' }}>
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Cloud size={16} style={{ color: 'var(--color-indigo)' }} />
                          全班即時文字雲 (Class Word Cloud)：
                        </h4>
                      </div>
                      
                      <div 
                        className="glass-card wordcloud-container animate-slide-up"
                        style={{ 
                          minHeight: '180px', 
                          maxHeight: '260px',
                          overflowY: 'auto',
                          padding: '1.25rem', 
                          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)',
                          border: '1px solid var(--border-glow)'
                        }}
                      >
                        {(() => {
                          const myWords = (textAnswer || '').split(/[,，;；、\s\n]+/).map(w => w.trim().toLowerCase());
                          const sortedList = (liveStats.wordCloud && liveStats.wordCloud.sortedList) || [];
                          
                          if (sortedList.length === 0) {
                            return (
                              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <Cloud size={32} style={{ opacity: 0.4, marginBottom: '0.4rem' }} className="animate-pulse" />
                                <p style={{ margin: 0 }}>即時文字雲統計中...</p>
                              </div>
                            );
                          }

                          const maxCount = sortedList[0].count;
                          const minCount = sortedList[sortedList.length - 1].count;
                          const WORD_COLORS = ['#818cf8', '#a78bfa', '#f472b6', '#22d3ee', '#34d399', '#fbbf24', '#60a5fa'];

                          return sortedList.map((item, idx) => {
                            const isMine = myWords.includes(item.text.toLowerCase());
                            const color = WORD_COLORS[idx % WORD_COLORS.length];
                            const ratio = maxCount === minCount ? 0.5 : (item.count - minCount) / (maxCount - minCount);
                            const fontSize = `${(0.95 + ratio * 1.15).toFixed(2)}rem`;

                            return (
                              <span 
                                key={idx}
                                className="wordcloud-tag animate-pop"
                                style={{
                                  fontSize,
                                  fontWeight: isMine || item.count > 1 ? 700 : 500,
                                  color: isMine ? '#fff' : color,
                                  background: isMine ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                                  border: isMine ? '1px solid var(--color-indigo)' : 'none',
                                  padding: isMine ? '0.15rem 0.45rem' : '0',
                                  borderRadius: '6px',
                                  textShadow: isMine ? '0 0 12px rgba(99, 102, 241, 0.8)' : `0 0 8px ${color}33`,
                                  lineHeight: '1.2'
                                }}
                              >
                                {item.text}
                                {item.count > 1 && (
                                  <sup style={{ fontSize: '0.6em', opacity: 0.85, marginLeft: '0.15rem' }}>({item.count})</sup>
                                )}
                              </span>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Pair Discussion Responses List */}
                  {activeQuestion.type === 'pair' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Users size={16} style={{ color: '#06b6d4' }} /> 全班雙人討論成果 (Class Pair Insights)：
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                        {liveStats.pairDiscussions && liveStats.pairDiscussions.length > 0 ? (
                          liveStats.pairDiscussions.map((item, idx) => (
                            <div key={idx} className="glass-card" style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', borderLeft: '3px solid #06b6d4' }}>
                              <div className="flex-between">
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.studentName === nickname ? 'var(--color-indigo)' : 'var(--text-secondary)' }}>
                                  👥 {item.studentName}{item.partnerName ? ` & ${item.partnerName}` : ''}{item.studentName === nickname ? ' (你們)' : ''}
                                </span>
                              </div>
                              <div style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>
                                <FormattedMarkdown text={item.summary} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="glass-card" style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-indigo)' }}>
                              👥 {nickname} {partnerName ? `& ${partnerName}` : ''} (你們)
                            </span>
                            <div style={{ color: 'var(--text-primary)', marginTop: '0.3rem' }}>
                              <FormattedMarkdown text={pairSummary} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Short Answer Responses List */}
                  {activeQuestion.type === 'short' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>全班回答列表 (Class Responses)：</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                        {liveStats.shortAnswers && liveStats.shortAnswers.length > 0 ? (
                          liveStats.shortAnswers.map((item, idx) => (
                            <div key={idx} className="glass-card" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.studentName === nickname ? 'var(--color-indigo)' : 'var(--text-secondary)' }}>
                                {item.studentName}{item.studentName === nickname ? ' (你)' : ''}
                              </span>
                              <span style={{ color: 'var(--text-primary)' }}>{item.text}</span>
                            </div>
                          ))
                        ) : (
                          <div className="glass-card" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-indigo)' }}>{nickname} (你)</span>
                            <div style={{ color: 'var(--text-primary)', marginTop: '0.2rem' }}>{textAnswer}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ordering Details */}
                  {activeQuestion.type === 'ordering' && (
                    <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>你的排序結果 (Your Submitted Order)：</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {orderingItems.map((item, idx) => {
                          const isCorrect = item.correctNum === idx + 1;
                          return (
                            <div 
                              key={idx} 
                              className="glass-card" 
                              style={{ 
                                padding: '0.75rem 1rem', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.05)',
                                borderColor: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)'
                              }}
                            >
                              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isCorrect ? 'var(--color-success)' : '#ef4444' }}>
                                  #{idx + 1}
                                </span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                  <FormattedMarkdown text={item.text} />
                                </span>
                              </div>
                              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: isCorrect ? 'var(--color-success)' : 'var(--text-secondary)' }}>
                                {isCorrect ? 'Correct ✅' : `Correct is #${item.correctNum}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>🏆 標準正確排序：</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '1rem', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                        {[...orderingItems].sort((a, b) => a.correctNum - b.correctNum).map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.85rem', display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <strong>{item.correctNum}.</strong>
                            <span><FormattedMarkdown text={item.text} /></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Live Status Notice Footer */}
                  <div style={{ marginTop: '1.25rem', textAlign: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                      <Hourglass size={14} className="animate-spin" />
                      {roomState === 'stopped' 
                        ? '老師已停止答題，請看前方投影幕檢討，等待下一題...' 
                        : '即時統計持續更新中，請稍候老師結束作答...'}
                    </p>
                  </div>
                </div>
              ) : activeQuestion.type === 'ordering' ? (
                /* Ordering Sorting UI */
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    💡 可直接按住左側圖示拖曳項目，或點擊上下箭頭調整順序，完成後按送出：
                  </p>
                  <div 
                    style={{ marginBottom: '1.5rem' }}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {orderingItems.map((item, idx) => {
                      const isDragging = draggedIdx === idx;
                      const isDragOver = dragOverIdx === idx && draggedIdx !== idx;
                      return (
                        <div 
                          key={item.id || idx} 
                          data-order-idx={idx}
                          className={`sortable-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                          draggable={!hasSubmitted && roomState === 'answering'}
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragEnter={(e) => handleDragEnter(e, idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDragEnd={handleDragEnd}
                          onDrop={(e) => handleDrop(e, idx)}
                        >
                          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flex: 1 }}>
                            <div 
                              className="sortable-handle"
                              onTouchStart={(e) => handleTouchStart(e, idx)}
                              title="按住拖曳"
                            >
                              <GripVertical size={18} />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-indigo)', fontWeight: 'bold', minWidth: '18px' }}>
                              {idx + 1}.
                            </span>
                            <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                              <FormattedMarkdown text={item.text} />
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.5rem' }}>
                            <button 
                              type="button" 
                              className="btn btn-secondary btn-icon" 
                              style={{ padding: '0.3rem' }} 
                              onClick={() => moveOrderItem(idx, 'up')}
                              disabled={idx === 0 || hasSubmitted}
                              title="上移"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-secondary btn-icon" 
                              style={{ padding: '0.3rem' }} 
                              onClick={() => moveOrderItem(idx, 'down')}
                              disabled={idx === orderingItems.length - 1 || hasSubmitted}
                              title="下移"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '0.95rem', fontSize: '1rem' }} 
                    onClick={submitOrderValue}
                    disabled={submitting}
                  >
                    送出排序 Submit Order <CornerDownRight size={18} />
                  </button>
                </div>
              ) : activeQuestion.type === 'wordcloud' ? (
                /* Word Cloud Keyword Input UI */
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      <Cloud size={16} style={{ color: 'var(--color-indigo)' }} />
                      輸入關鍵字 / 詞彙 (可輸入 1~3 個)：
                    </label>
                    <textarea
                      className="input-field"
                      style={{ 
                        width: '100%', 
                        minHeight: '85px', 
                        padding: '0.85rem 1rem', 
                        fontSize: '1rem',
                        resize: 'none',
                        fontFamily: 'inherit',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        margin: '0 0 0.4rem 0'
                      }}
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="例如：iPhone, Notion, 保溫杯 (可用逗號或空格分隔)"
                      maxLength={100}
                      disabled={submitting}
                    />
                    
                    {/* Live Preview Chips */}
                    {textAnswer.trim() && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>預覽詞彙：</span>
                        {textAnswer.split(/[,，;；、\s\n]+/).filter(t => t.trim().length > 0).map((w, i) => (
                          <span key={i} className="badge badge-indigo animate-pop" style={{ fontSize: '0.8rem', padding: '0.2rem 0.55rem' }}>
                            ✨ {w.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                    onClick={submitTextValue}
                    disabled={submitting || !textAnswer.trim()}
                  >
                    送出詞彙 Submit Words <CornerDownRight size={18} />
                  </button>
                </div>
              ) : activeQuestion.type === 'pair' ? (
                /* Pair Discussion Form */
                <div>
                  {activeQuestion.description && (
                    <div className="glass-card" style={{ padding: '0.85rem 1rem', marginBottom: '1.25rem', background: 'rgba(6, 182, 212, 0.05)', borderColor: 'rgba(6, 182, 212, 0.25)', borderRadius: '10px' }}>
                      <h4 style={{ color: '#22d3ee', fontSize: '0.85rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Users size={14} /> 討論引導與任務：
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                        <FormattedMarkdown text={activeQuestion.description} />
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <Users size={14} style={{ color: '#06b6d4' }} />
                      同組夥伴姓名 / 暱稱：
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      style={{ 
                        width: '100%', 
                        padding: '0.7rem 0.9rem', 
                        fontSize: '0.92rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)'
                      }}
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="例如：王大同 / 隔壁同學 (選填)"
                      maxLength={30}
                      disabled={submitting}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <MessageSquare size={14} style={{ color: '#06b6d4' }} />
                      雙人討論重點簡述 (Discussion Summary)：
                    </label>
                    <textarea
                      className="input-field"
                      style={{ 
                        width: '100%', 
                        minHeight: '115px', 
                        padding: '0.85rem', 
                        fontSize: '0.95rem',
                        resize: 'none',
                        fontFamily: 'inherit',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        lineHeight: '1.5',
                        margin: '0 0 0.35rem 0'
                      }}
                      value={pairSummary}
                      onChange={(e) => setPairSummary(e.target.value)}
                      placeholder="簡述你們這組討論出的主要觀點、案例成因或關鍵結論..."
                      maxLength={300}
                      disabled={submitting}
                    />
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {pairSummary.length}/300 字
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
                    onClick={submitPairValue}
                    disabled={submitting || !pairSummary.trim()}
                  >
                    送出討論結果 Submit Discussion <CornerDownRight size={18} />
                  </button>
                </div>
              ) : activeQuestion.type === 'short' ? (
                /* Short Answer Text Input UI */
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <textarea
                      className="input-field"
                      style={{ 
                        width: '100%', 
                        minHeight: '120px', 
                        padding: '1rem', 
                        fontSize: '1rem',
                        resize: 'none',
                        fontFamily: 'inherit',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        margin: '0 0 0.5rem 0'
                      }}
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      maxLength={100}
                      disabled={submitting}
                    />
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {textAnswer.length}/100 characters
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem' }}
                    onClick={submitTextValue}
                    disabled={submitting || !textAnswer.trim()}
                  >
                    Submit Answer <CornerDownRight size={18} />
                  </button>
                </div>
              ) : (
                /* Standard Multiple Choice Buttons (A, B, C, D, E...) */
                <div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                     {activeQuestion.options.map((opt, idx) => {
                       const letter = String.fromCharCode(65 + idx);
                       const isSelected = selectedOption === letter;
                       return (
                         <button 
                           key={idx}
                           type="button"
                           className={`option-btn ${isSelected ? 'selected' : ''}`}
                           onClick={() => selectOptionValue(letter)}
                           disabled={submitting}
                         >
                           <span className="option-letter">{letter}</span>
                           <span style={{ fontSize: '0.95rem' }}><FormattedMarkdown text={opt} /></span>
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

            {!hasSubmitted && roomState === 'answering' && (
              <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {activeQuestion.type === 'game' ? '⚠️ Speed scoring enabled! Answer quickly.' : 'Review your selection before submitting.'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* STOPPED / WAITING RESULTS STATE WITHOUT ACTIVE QUESTION */}
        {roomState === 'stopped' && !activeQuestion && (
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

        {/* TIMEOUT SESSION STATE */}
        {roomState === 'timeout' && (
          <div className="glass-card flex-center animate-pop" style={{ flex: 1, flexDirection: 'column', textAlign: 'center', padding: '3rem 1.5rem' }}>
            <AlertCircle size={64} style={{ color: 'var(--color-warning)', marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Room Timed Out</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px', marginBottom: '2rem' }}>
              This interactive session has automatically closed due to 5 minutes of inactivity.
            </p>
            <button className="btn btn-primary" onClick={onLeave} style={{ width: '100%', padding: '1rem' }}>
              Back to Home
            </button>
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
