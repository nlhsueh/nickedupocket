import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Play, Square, ChevronRight, ArrowLeft, Users, Wifi, WifiOff, 
  CheckCircle, AlertCircle, Award, Hourglass, RefreshCw, BarChart2, Star, Cloud, FlaskConical, CheckCircle2
} from 'lucide-react';
import mqttService from '../utils/mqtt';
import FormattedMarkdown from '../utils/formatMarkdown';
import PieChart from './PieChart';

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
  const [roundScores, setRoundScores] = useState({}); // { studentName: { gained, isCorrect, elapsedSec } }
  
  // View modes & Spotlight
  const [shortAnswerViewMode, setShortAnswerViewMode] = useState('grid'); // 'grid' or 'danmaku'
  const [wordCloudViewMode, setWordCloudViewMode] = useState('cloud'); // 'cloud', 'ranking', 'raw'
  const [pollViewMode, setPollViewMode] = useState('pie'); // 'pie' (default for Survey/Poll) or 'bar'
  const [spotlightPair, setSpotlightPair] = useState(null);
  const [pairSearchQuery, setPairSearchQuery] = useState('');
  const [simulationToast, setSimulationToast] = useState('');
  
  // Helper for smart default duration per question type
  const getDefaultDurationForQuestion = (q) => {
    if (!q) return 90;
    if (q.timeLimit && q.timeLimit > 0) return q.timeLimit;
    switch (q.type) {
      case 'pair': return 300;      // 5 min for Pair Discussion
      case 'wordcloud': return 180; // 3 min for typing keywords
      case 'short': return 180;     // 3 min for typing sentences
      case 'ordering': return 180;  // 3 min for ordering
      case 'ccq': return 90;        // 1.5 min for CCQ
      case 'poll': return 60;       // 1 min for Poll
      case 'game': return 20;       // 20s for Game
      default: return 90;
    }
  };

  // Configurable pre-start duration (teacher can adjust anytime before starting)
  const [configuredDuration, setConfiguredDuration] = useState(() => 
    getDefaultDurationForQuestion(activity.questions[0])
  );

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

  // Extract word cloud frequencies and submissions
  const getWordCloudFrequencies = (answersMap) => {
    const ansMap = answersMap || answers;
    const qIndex = currentQIndexRef.current;
    const freqMap = {};
    const submissions = [];

    Object.keys(ansMap).forEach(stName => {
      const item = ansMap[stName];
      if (item && item.questionIndex === qIndex && item.answer) {
        const rawText = String(item.answer).trim();
        submissions.push({ studentName: stName, text: rawText, timestamp: item.timestamp });
        
        // Tokenize words by comma, fullwidth comma, semicolon, space, newline, slash, etc.
        const tokens = rawText
          .split(/[,，;；、\/\\\s\n+&|]+/)
          .map(t => t.trim().replace(/^["'“”‘’#@]+|["'“”‘’#@]+$/g, ''))
          .filter(t => t.length > 0 && t.length <= 40);

        tokens.forEach(tok => {
          freqMap[tok] = (freqMap[tok] || 0) + 1;
        });
      }
    });

    const sortedList = Object.entries(freqMap)
      .map(([text, count]) => ({ text, count }))
      .sort((a, b) => b.count - a.count);

    return {
      freqMap,
      sortedList,
      totalSubmissions: submissions.length,
      totalWords: sortedList.reduce((acc, curr) => acc + curr.count, 0),
      submissions
    };
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
    const pairList = [];

    Object.keys(ansMap).forEach(stName => {
      const item = ansMap[stName];
      if (item && item.questionIndex === qIndex && item.answer !== undefined) {
        if (stats[item.answer] !== undefined) {
          stats[item.answer]++;
        }
        total++;
        if (q.type === 'short' || q.type === 'wordcloud') {
          shortList.push({ studentName: stName, text: typeof item.answer === 'string' ? item.answer : JSON.stringify(item.answer), timestamp: item.timestamp });
        }
        if (q.type === 'pair') {
          let summary = '';
          let partnerName = '';
          if (typeof item.answer === 'object' && item.answer !== null) {
            summary = item.answer.summary || item.answer.text || '';
            partnerName = item.answer.partnerName || '';
          } else if (typeof item.answer === 'string') {
            try {
              const p = JSON.parse(item.answer);
              summary = p.summary || p.text || item.answer;
              partnerName = p.partnerName || '';
            } catch (e) {
              summary = item.answer;
            }
          }
          pairList.push({ studentName: stName, partnerName, summary, timestamp: item.timestamp });
        }
      }
    });

    const wordCloudData = (q.type === 'wordcloud') ? getWordCloudFrequencies(ansMap) : null;

    broadcastState({
      event: 'stats_update',
      questionIndex: qIndex,
      stats,
      totalSubmissions: total,
      totalStudents: joinedStudents.length,
      shortAnswers: shortList,
      pairDiscussions: pairList,
      wordCloud: wordCloudData ? {
        freqMap: wordCloudData.freqMap,
        sortedList: wordCloudData.sortedList,
        totalWords: wordCloudData.totalWords
      } : null,
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

    // Determine duration: configuredDuration set by teacher, or smart default
    const q = activity.questions[currentQIndex];
    const duration = configuredDuration || getDefaultDurationForQuestion(q);

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

    let duration = explicitDuration || timeLeftRef.current || getDefaultDurationForQuestion(q);

    if (q.type === 'ordering') {
      broadcastState({
        event: 'question_start',
        type: 'ordering',
        questionIndex: idx,
        questionText: q.questionText,
        description: q.description || '',
        items: q.items,
        timeLimit: duration
      });
    } else {
      broadcastState({
        event: 'question_start',
        type: q.type,
        questionIndex: idx,
        questionText: q.questionText,
        description: q.description || '',
        options: q.options || [],
        timeLimit: duration
      });
    }
  };

  const stopQuestion = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSessionStatus('results');

    let gameData = null;
    if (currentQuestion.type === 'game') {
      const { newScores, currentRoundGains } = calculateGameScores();
      const sortedLeaderboard = Object.entries(newScores)
        .map(([name, score]) => ({ 
          name, 
          score, 
          roundGain: currentRoundGains[name]?.gained || 0,
          isCorrect: currentRoundGains[name]?.isCorrect || false
        }))
        .sort((a, b) => b.score - a.score);

      gameData = {
        scores: newScores,
        roundGains: currentRoundGains,
        leaderboard: sortedLeaderboard
      };
    }

    const q = activity.questions[currentQIndex];
    const statsObj = getMultipleChoiceStats();
    const wordCloudData = (q && q.type === 'wordcloud') ? getWordCloudFrequencies() : null;

    broadcastState({ 
      event: 'question_stop', 
      questionIndex: currentQIndex,
      correctAnswer: q ? q.correctAnswer : null,
      stats: statsObj.stats,
      totalSubmissions: statsObj.total,
      totalStudents: joinedStudents.length,
      shortAnswers: getShortAnswers(),
      pairDiscussions: getPairDiscussions(),
      wordCloud: wordCloudData ? {
        freqMap: wordCloudData.freqMap,
        sortedList: wordCloudData.sortedList,
        totalWords: wordCloudData.totalWords
      } : null,
      gameData
    });
  };

  const nextQuestionAndStart = () => {
    if (currentQIndex < activity.questions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      currentQIndexRef.current = nextIdx;
      setAnswers({});
      setShortAnswerViewMode('grid');
      setWordCloudViewMode('cloud');
      
      const nextQ = activity.questions[nextIdx];
      const duration = getDefaultDurationForQuestion(nextQ);
      setConfiguredDuration(duration);

      // Start next question immediately without going back to lobby
      setSessionStatus('active');
      sessionStatusRef.current = 'active';
      const now = Date.now();
      setQuestionStartTime(now);
      setTimeLeft(duration);
      timeLeftRef.current = duration;

      // Broadcast active question to students
      broadcastActiveQuestion(nextIdx, duration);

      // Start countdown timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            stopQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSessionStatus('finished');
      sessionStatusRef.current = 'finished';
      broadcastState({ event: 'session_finished' });
    }
  };

  const nextQuestion = nextQuestionAndStart;

  // 4. Game Score calculations (方案 A: 答對 850 + 速度加成最高 150，答錯扣 300，未作答 0)
  const calculateGameScores = (answersMap) => {
    const q = activity.questions[currentQIndex];
    const newScores = { ...studentScores };
    const ansMap = answersMap || answers;
    const currentRoundGains = {};

    joinedStudents.forEach((studentName) => {
      const response = ansMap[studentName];
      const timeLimitMs = (q.timeLimit || 20) * 1000;

      if (response && response.questionIndex === currentQIndex) {
        const elapsed = Math.max(0, response.timestamp - questionStartTime);
        const elapsedSec = (elapsed / 1000).toFixed(1);

        if (response.answer === q.correctAnswer) {
          // 答對：基礎分 850 + 速度加成最高 150 (依作答耗時遞減)
          let speedBonus = 150;
          if (timeLimitMs > 0) {
            const ratio = Math.max(0, Math.min(1, elapsed / timeLimitMs));
            speedBonus = Math.round(150 * (1 - ratio));
          }
          const questionScore = 850 + speedBonus;

          newScores[studentName] = (newScores[studentName] || 0) + questionScore;
          currentRoundGains[studentName] = {
            gained: questionScore,
            isCorrect: true,
            hasAnswered: true,
            elapsedSec: elapsedSec
          };
        } else {
          // 答錯：扣 300 分
          const questionScore = -300;
          newScores[studentName] = (newScores[studentName] || 0) + questionScore;
          currentRoundGains[studentName] = {
            gained: questionScore,
            isCorrect: false,
            hasAnswered: true,
            elapsedSec: elapsedSec
          };
        }
      } else {
        // 逾時未作答：0 分（不扣分）
        newScores[studentName] = newScores[studentName] || 0;
        currentRoundGains[studentName] = {
          gained: 0,
          isCorrect: false,
          hasAnswered: false,
          elapsedSec: null
        };
      }
    });

    setStudentScores(newScores);
    setRoundScores(currentRoundGains);
    return { newScores, currentRoundGains };
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
          text: typeof ans.answer === 'string' ? ans.answer : JSON.stringify(ans.answer),
          timestamp: ans.timestamp
        });
      }
    });
    return list;
  };

  // Extract all pair discussion responses
  const getPairDiscussions = () => {
    const list = [];
    Object.keys(answers).forEach((studentName) => {
      const ans = answers[studentName];
      if (ans.questionIndex === currentQIndex && ans.answer) {
        let summary = '';
        let partnerName = '';
        if (typeof ans.answer === 'object' && ans.answer !== null) {
          summary = ans.answer.summary || ans.answer.text || '';
          partnerName = ans.answer.partnerName || '';
        } else if (typeof ans.answer === 'string') {
          try {
            const parsed = JSON.parse(ans.answer);
            summary = parsed.summary || parsed.text || ans.answer;
            partnerName = parsed.partnerName || '';
          } catch (e) {
            summary = ans.answer;
          }
        }
        list.push({
          studentName,
          partnerName,
          summary,
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

  // Helper to simulate 3 students (st01, st02, st03) joining and answering
  const handleSimulateStudents = () => {
    const simStudents = ['🦊 st01', '🐼 st02', '🌻 st03'];
    const now = Date.now();
    const q = activity.questions[currentQIndex];

    // 1. Ensure students are in joinedStudents
    setJoinedStudents(prev => {
      const next = [...prev];
      simStudents.forEach(st => {
        if (!next.includes(st)) next.push(st);
      });
      return next;
    });

    // Broadcast presence via MQTT
    simStudents.forEach(st => {
      mqttService.publishResponse({ event: 'join', studentName: st });
    });

    // 2. If question is active or results, simulate realistic submissions
    if (sessionStatus === 'active' || sessionStatus === 'results') {
      const mockAnswers = {};

      if (q.type === 'ccq' || q.type === 'poll' || q.type === 'game') {
        const opts = (q.options && q.options.length > 0)
          ? q.options.map((_, i) => String.fromCharCode(65 + i))
          : ['A', 'B', 'C', 'D'];
        const correctOpt = q.correctAnswer || opts[0];
        const otherOpts = opts.filter(o => o !== correctOpt);
        const opt2 = otherOpts[0] || opts[1] || 'B';
        const opt3 = otherOpts[1] || opts[0] || 'C';

        mockAnswers['🦊 st01'] = {
          answer: correctOpt,
          timestamp: (questionStartTime || (now - 8000)) + 2150,
          questionIndex: currentQIndex
        };
        mockAnswers['🐼 st02'] = {
          answer: q.type === 'poll' ? opt2 : (Math.random() > 0.3 ? correctOpt : opt2),
          timestamp: (questionStartTime || (now - 8000)) + 4300,
          questionIndex: currentQIndex
        };
        mockAnswers['🌻 st03'] = {
          answer: q.type === 'poll' ? opt3 : (Math.random() > 0.5 ? correctOpt : opt3),
          timestamp: (questionStartTime || (now - 8000)) + 6800,
          questionIndex: currentQIndex
        };
      } else if (q.type === 'pair') {
        mockAnswers['🦊 st01'] = {
          answer: {
            summary: '我們這組討論認為微服務的痛點在於服務依賴深與網路延遲，建議引入契約測試（Pact）與 Docker 容器化隔離。',
            partnerName: '🐼 st02'
          },
          timestamp: now - 3000,
          questionIndex: currentQIndex
        };
        mockAnswers['🌻 st03'] = {
          answer: {
            summary: '單體架構重構為微服務時最容易忽略資料一致性，需配合事件驅動架構與分散式追蹤（OpenTelemetry）提高可觀測性。',
            partnerName: '🦁 st04'
          },
          timestamp: now - 1200,
          questionIndex: currentQIndex
        };
      } else if (q.type === 'wordcloud') {
        mockAnswers['🦊 st01'] = {
          answer: '敏捷開發, 自動化測試, CI/CD',
          timestamp: now - 3500,
          questionIndex: currentQIndex
        };
        mockAnswers['🐼 st02'] = {
          answer: '單元測試, 敏捷開發, 程式碼審查',
          timestamp: now - 2000,
          questionIndex: currentQIndex
        };
        mockAnswers['🌻 st03'] = {
          answer: '持續重構, 自動化測試, 乾淨架構',
          timestamp: now - 800,
          questionIndex: currentQIndex
        };
      } else if (q.type === 'ordering') {
        const items = q.items || [];
        const swapped = [...items];
        if (swapped.length >= 2) {
          const tmp = swapped[0];
          swapped[0] = swapped[1];
          swapped[1] = tmp;
        }
        mockAnswers['🦊 st01'] = {
          answer: items,
          timestamp: now - 4000,
          questionIndex: currentQIndex
        };
        mockAnswers['🐼 st02'] = {
          answer: swapped,
          timestamp: now - 2500,
          questionIndex: currentQIndex
        };
        mockAnswers['🌻 st03'] = {
          answer: items,
          timestamp: now - 1200,
          questionIndex: currentQIndex
        };
      } else if (q.type === 'short') {
        mockAnswers['🦊 st01'] = {
          answer: '先寫失敗的測試確認規格邊界，再用最簡程式碼使其通過，最後重構優化架構。',
          timestamp: now - 3000,
          questionIndex: currentQIndex
        };
        mockAnswers['🐼 st02'] = {
          answer: '紅綠燈循環能建立回歸防護網，及時消除壞味道並維持系統高品質與可維護性。',
          timestamp: now - 2000,
          questionIndex: currentQIndex
        };
        mockAnswers['🌻 st03'] = {
          answer: 'TDD 能驅動模組低耦合設計，從使用者調用觀點出發定義清晰簡潔的 API 介面。',
          timestamp: now - 1000,
          questionIndex: currentQIndex
        };
      }

      setAnswers(prev => {
        const next = { ...prev, ...mockAnswers };
        broadcastCurrentStats(next);
        return next;
      });

      Object.entries(mockAnswers).forEach(([stName, data]) => {
        mqttService.publishResponse({
          event: 'submit_answer',
          studentName: stName,
          answer: data.answer,
          timestamp: data.timestamp,
          questionIndex: data.questionIndex
        });
      });

      if (q.type === 'game') {
        calculateGameScores(mockAnswers);
      }

      setSimulationToast('🧪 已模擬學生 🦊st01, 🐼st02, 🌻st03 送出作答！');
    } else {
      broadcastLobbyState();
      setSimulationToast('🧪 已模擬學生 🦊st01, 🐼st02, 🌻st03 加入房間大廳！');
    }

    setTimeout(() => {
      setSimulationToast('');
    }, 3500);
  };

  return (
    <div className="container animate-slide-up" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
      {/* Session Header */}
      <div className="flex-between glass-card" style={{ marginBottom: '1.5rem', padding: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button className="btn btn-secondary btn-icon" onClick={onBack} title="回到 NickPocketEdu">
            <ArrowLeft size={18} /> Exit
          </button>
          <div 
            onClick={onBack}
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              userSelect: 'none',
              padding: '0.2rem 0.5rem',
              borderRadius: '8px'
            }}
            title="點擊回到 NickPocketEdu"
          >
            <span className="text-gradient" style={{ fontSize: '1.35rem', fontWeight: 800 }}>NickPocketEdu</span>
            <span style={{ color: 'var(--border-light)', fontSize: '1.1rem' }}>|</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600, maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={activity.title}>
              {activity.title}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Test Simulation Button */}
          <button 
            type="button"
            className="btn btn-secondary" 
            style={{ 
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(168, 85, 247, 0.15))',
              border: '1px solid rgba(236, 72, 153, 0.45)',
              color: '#f472b6',
              padding: '0.45rem 0.9rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(236, 72, 153, 0.15)'
            }}
            onClick={handleSimulateStudents}
            title="模擬三個學生 st01, st02, st03 加入房間並自動作答"
          >
            <FlaskConical size={16} /> 模擬學生 (st01~st03)
          </button>

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
              
              <p style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Direct Link: <a href={studentUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-indigo)', textDecoration: 'underline' }}>{studentUrl}</a>
              </p>
              
              {/* Pre-start Timer Duration Setting Panel */}
              <div className="glass-card" style={{ width: '100%', marginTop: '1.25rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '14px', textAlign: 'left' }}>
                <div className="flex-between" style={{ marginBottom: '0.6rem', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                    <Hourglass size={15} style={{ color: 'var(--color-indigo)' }} />
                    作答倒數時間 (Timer Duration)：
                  </span>
                  <span className="badge badge-indigo" style={{ fontSize: '0.95rem', padding: '0.25rem 0.65rem', fontFamily: 'monospace' }}>
                    ⏱️ {formatTime(configuredDuration)} ({configuredDuration}s)
                  </span>
                </div>

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem', justifyContent: 'center' }}>
                  {[
                    { label: '30s', secs: 30 },
                    { label: '60s (1分)', secs: 60 },
                    { label: '90s (1.5分)', secs: 90 },
                    { label: '120s (2分)', secs: 120 },
                    { label: '180s (3分)', secs: 180 },
                    { label: '300s (5分)', secs: 300 }
                  ].map(p => (
                    <button
                      key={p.secs}
                      type="button"
                      className={`btn ${configuredDuration === p.secs ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', borderRadius: '8px' }}
                      onClick={() => setConfiguredDuration(p.secs)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Stepper Fine-tuning */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => setConfiguredDuration(prev => Math.max(10, prev - 30))}
                  >
                    -30s
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => setConfiguredDuration(prev => Math.max(10, prev - 15))}
                  >
                    -15s
                  </button>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>微調</span>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => setConfiguredDuration(prev => prev + 15)}
                  >
                    +15s
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => setConfiguredDuration(prev => prev + 30)}
                  >
                    +30s
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => setConfiguredDuration(prev => prev + 60)}
                  >
                    +1分
                  </button>
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem', width: '100%' }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }} onClick={startQuestion}>
                  <Play size={18} fill="white" /> Start Activity ({formatTime(configuredDuration)})
                </button>
              </div>
            </div>

            {/* Right card: Connected Students list */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '450px' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={20} /> Students Connected ({joinedStudents.length})
                </h3>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem', color: '#f472b6', borderColor: 'rgba(236, 72, 153, 0.4)' }}
                  onClick={handleSimulateStudents}
                  title="模擬 st01, st02, st03 加入"
                >
                  <FlaskConical size={13} /> + 模擬加入
                </button>
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
              {/* Clickable breadcrumb title to return to NickPocketEdu */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <span 
                  onClick={onBack}
                  style={{ 
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    color: 'var(--color-indigo)',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="點擊回到 NickPocketEdu"
                >
                  <ArrowLeft size={14} /> NickPocketEdu
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/</span>
                <span 
                  onClick={onBack}
                  style={{ 
                    cursor: 'pointer', 
                    fontSize: '0.88rem', 
                    color: 'var(--text-secondary)',
                    fontWeight: 600
                  }}
                  title="點擊回到 NickPocketEdu"
                >
                  {activity.title}
                </span>
              </div>

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
              
              <h1 style={{ fontSize: '1.85rem', lineHeight: '1.45', marginBottom: '2rem' }}>
                <FormattedMarkdown text={currentQuestion.questionText} />
              </h1>

              {/* Render Question Choices (static visual display for students/teacher screen) */}
              {currentQuestion.type !== 'ordering' && currentQuestion.type !== 'short' && currentQuestion.type !== 'wordcloud' && currentQuestion.options && (
                <div className="grid-2" style={{ gap: '1rem' }}>
                  {currentQuestion.options.map((opt, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    return (
                      <div key={idx} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid var(--border-light)' }}>
                        <span className="option-letter" style={{ background: 'rgba(255,255,255,0.05)' }}>{letters[idx]}</span>
                        <span style={{ fontSize: '1.1rem' }}><FormattedMarkdown text={opt} /></span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Active Screen Live Word Cloud */}
              {currentQuestion.type === 'wordcloud' && (() => {
                const { sortedList, totalWords } = getWordCloudFrequencies();
                const maxCount = sortedList.length > 0 ? sortedList[0].count : 1;
                const minCount = sortedList.length > 0 ? sortedList[sortedList.length - 1].count : 1;
                const WORD_COLORS = ['#818cf8', '#a78bfa', '#f472b6', '#22d3ee', '#34d399', '#fbbf24', '#60a5fa', '#f87171', '#c084fc', '#38bdf8'];

                const getFontSize = (count) => {
                  if (maxCount === minCount) return '2.3rem';
                  const ratio = (count - minCount) / (maxCount - minCount);
                  return `${(1.5 + ratio * 2.8).toFixed(2)}rem`;
                };

                return (
                  <div style={{ marginTop: '1.5rem' }}>
                    {/* Hot Keywords Bar */}
                    {sortedList.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          🔥 熱門詞彙：
                        </span>
                        {sortedList.slice(0, 5).map((item, idx) => (
                          <span 
                            key={idx} 
                            className="badge animate-pop" 
                            style={{ 
                              fontSize: '0.95rem', 
                              padding: '0.35rem 0.8rem',
                              background: idx === 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                              borderColor: idx === 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                              color: idx === 0 ? '#fbbf24' : 'var(--text-primary)'
                            }}
                          >
                            {idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : `#${idx + 1} `}
                            <strong>{item.text}</strong> ({item.count})
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Word Cloud Visual Canvas */}
                    <div 
                      className="glass-card flex-center wordcloud-container animate-slide-up" 
                      style={{ 
                        minHeight: '280px', 
                        maxHeight: '380px', 
                        overflowY: 'auto',
                        padding: '2rem', 
                        background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)',
                        border: '1px solid var(--border-glow)'
                      }}
                    >
                      {sortedList.length > 0 ? (
                        sortedList.map((item, idx) => {
                          const color = WORD_COLORS[idx % WORD_COLORS.length];
                          const size = getFontSize(item.count);
                          const isTop = idx === 0 && item.count > 1;

                          return (
                            <span 
                              key={idx} 
                              className="wordcloud-tag animate-pop"
                              style={{ 
                                fontSize: size,
                                fontWeight: item.count > 1 ? 700 : 500,
                                color: color,
                                textShadow: isTop ? `0 0 20px ${color}88` : `0 0 10px ${color}44`,
                                lineHeight: '1.2'
                              }}
                              title={`${item.text}: ${item.count} 次提及`}
                            >
                              {item.text}
                              {item.count > 1 && (
                                <sup style={{ fontSize: '0.55em', opacity: 0.8, background: 'rgba(255,255,255,0.1)', padding: '0.1em 0.35em', borderRadius: '10px' }}>
                                  {item.count}
                                </sup>
                              )}
                            </span>
                          );
                        })
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          <Cloud size={48} style={{ opacity: 0.3, marginBottom: '0.75rem' }} className="animate-pulse" />
                          <p style={{ fontSize: '1.1rem', margin: 0 }}>等待同學輸入詞彙中... (Waiting for submissions)</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Ordering static visual list */}
              {currentQuestion.type === 'ordering' && currentQuestion.items && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '600px' }}>
                  {currentQuestion.items.map((item, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span className="badge badge-indigo" style={{ padding: '0.25rem 0.5rem' }}>Item {idx + 1}</span>
                      <span style={{ fontSize: '1rem' }}><FormattedMarkdown text={item} /></span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pair Discussion Live Board during answering */}
              {currentQuestion.type === 'pair' && (() => {
                const pairs = getPairDiscussions();
                return (
                  <div>
                    {currentQuestion.description && (
                      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: 'rgba(6, 182, 212, 0.05)', borderColor: 'rgba(6, 182, 212, 0.25)', borderRadius: '12px' }}>
                        <h4 style={{ color: '#22d3ee', fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Users size={18} /> 雙人討論引導與任務：
                        </h4>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                          <FormattedMarkdown text={currentQuestion.description} />
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: '1.25rem' }}>
                      <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Users size={18} style={{ color: '#06b6d4' }} /> 即時雙人討論成果牆 ({pairs.length} 組已繳交)：
                        </h3>
                      </div>

                      {pairs.length === 0 ? (
                        <div className="glass-card flex-center" style={{ padding: '3rem 2rem', flexDirection: 'column', textAlign: 'center', color: 'var(--text-muted)' }}>
                          <Users size={48} style={{ opacity: 0.35, marginBottom: '0.75rem' }} className="animate-pulse" />
                          <p style={{ margin: 0, fontSize: '1rem' }}>請與同組夥伴交流討論，並在學生端簡述討論結論後送出...</p>
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                          {pairs.map((item, idx) => (
                            <div 
                              key={idx}
                              className="glass-card animate-pop"
                              style={{ 
                                padding: '1.25rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onClick={() => setSpotlightPair(item)}
                              title="點擊全螢幕放大討論"
                            >
                              <div>
                                <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
                                  <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <Users size={12} />
                                    <strong>{item.studentName}</strong> {item.partnerName ? `& ${item.partnerName}` : ''}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>#{idx + 1}</span>
                                </div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.55', wordBreak: 'break-word' }}>
                                  <FormattedMarkdown text={item.summary} />
                                </div>
                              </div>
                              <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                                <span style={{ fontSize: '0.75rem', color: '#22d3ee', opacity: 0.85 }}>🔍 點擊聚焦放大</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex-between" style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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
              
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button 
                  type="button"
                  className="btn btn-secondary" 
                  style={{ padding: '0.85rem 1.25rem', color: '#f472b6', borderColor: 'rgba(236, 72, 153, 0.45)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }} 
                  onClick={handleSimulateStudents}
                  title="模擬 st01, st02, st03 作答"
                >
                  <FlaskConical size={16} /> 模擬學生作答
                </button>
                <button className="btn btn-danger" style={{ padding: '1rem 2rem' }} onClick={stopQuestion}>
                  <Square size={16} fill="white" /> Stop Answering
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {sessionStatus === 'results' && (
          <div className="glass-card animate-slide-up" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                {/* Clickable breadcrumb title to return to NickPocketEdu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <span 
                    onClick={onBack}
                    style={{ 
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      color: 'var(--color-indigo)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                    title="點擊回到 NickPocketEdu"
                  >
                    <ArrowLeft size={14} /> NickPocketEdu
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/</span>
                  <span 
                    onClick={onBack}
                    style={{ 
                      cursor: 'pointer', 
                      fontSize: '0.88rem', 
                      color: 'var(--text-secondary)',
                      fontWeight: 600
                    }}
                    title="點擊回到 NickPocketEdu"
                  >
                    {activity.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-success">Answering Stopped</span>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Question Results</h2>
                </div>
              </div>

              {/* Action buttons: Next & Start for Game, or Next Question for Multi-question Surveys/Activities, or Return */}
              <div>
                {currentQuestion.type === 'game' ? (
                currentQIndex < activity.questions.length - 1 ? (
                  <button 
                    className="btn btn-primary" 
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      fontSize: '1rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }} 
                    onClick={nextQuestionAndStart}
                    title="進入下一題並立即開始搶答計時"
                  >
                    <Play size={18} fill="white" /> 下一題並立即搶答 (Next & Start)
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      fontSize: '1rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                    }} 
                    onClick={nextQuestionAndStart}
                    title="結算總分並揭曉最終冠軍頒獎台"
                  >
                    <Award size={18} /> 🏆 揭曉最終冠軍頒獎台 (View Final Podium)
                  </button>
                )
              ) : activity.questions.length > 1 && currentQIndex < activity.questions.length - 1 ? (
                /* Multi-question Survey / Activity */
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      fontSize: '0.95rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                    }} 
                    onClick={nextQuestionAndStart}
                    title="進入問卷下一題"
                  >
                    下一題問卷 (Next Question) <ChevronRight size={18} />
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }} 
                    onClick={onBack}
                    title="提前結束並回到 NickPocketEdu"
                  >
                    <ArrowLeft size={16} /> 返回
                  </button>
                </div>
              ) : activity.questions.length > 1 && currentQIndex === activity.questions.length - 1 ? (
                /* Multi-question Survey finished */
                <button 
                  className="btn btn-success" 
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    fontSize: '0.95rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  }} 
                  onClick={onBack}
                  title="問卷全數完成，返回 NickPocketEdu"
                >
                  <CheckCircle2 size={18} /> 完成問卷調查 (Finish Survey)
                </button>
              ) : (
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
                  onClick={onBack}
                  title="結束本題並回到 NickPocketEdu"
                >
                  <ArrowLeft size={16} /> 返回 NickPocketEdu
                </button>
              )}
              </div>
            </div>

            {/* Prominent Standard Correct Answer Banner (For CCQ & Game) */}
            {((currentQuestion.type === 'ccq' || currentQuestion.type === 'game') && currentQuestion.correctAnswer) && (
              <div 
                className="glass-card animate-pop" 
                style={{ 
                  padding: '1rem 1.5rem', 
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.22) 100%)',
                  border: '1.5px solid rgba(16, 185, 129, 0.5)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      標準正確答案 (Standard Correct Answer)
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ecfdf5', marginTop: '0.2rem' }}>
                      Option {currentQuestion.correctAnswer}
                      {currentQuestion.options && currentQuestion.options[currentQuestion.correctAnswer.charCodeAt(0) - 65] && (
                        <span style={{ fontWeight: 500, fontSize: '1.05rem', marginLeft: '0.5rem', color: '#d1fae5' }}>
                          — {currentQuestion.options[currentQuestion.correctAnswer.charCodeAt(0) - 65]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="badge badge-success" style={{ fontSize: '0.95rem', padding: '0.4rem 0.85rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.3)', border: '1px solid #10b981' }}>
                    🎉 答對人數：{Object.values(answers).filter(a => a.questionIndex === currentQIndex && a.answer === currentQuestion.correctAnswer).length} / {Object.keys(answers).length} 人
                  </span>
                </div>
              </div>
            )}

            <div className="grid-2" style={{ flex: 1, alignItems: 'start', gap: '2rem' }}>
              {/* Left Column: Visual Charts / Stats */}
              <div>
                {/* Visual Charts / Stats */}
                {(currentQuestion.type === 'ccq' || currentQuestion.type === 'poll' || currentQuestion.type === 'game') && (() => {
                  const { stats, total } = getMultipleChoiceStats();
                  const letters = (currentQuestion.options && currentQuestion.options.length > 0)
                    ? currentQuestion.options.map((_, i) => String.fromCharCode(65 + i))
                    : ['A', 'B', 'C', 'D'];
                  
                  // If question is Poll / Survey, show Donut PieChart by default with a toggle!
                  if (currentQuestion.type === 'poll') {
                    return (
                      <div>
                        {/* View Mode Toggle for Poll / Survey */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', alignItems: 'center' }}>
                          <button 
                            className={`btn ${pollViewMode === 'pie' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            onClick={() => setPollViewMode('pie')}
                          >
                            🥧 圓餅圖 (Pie Chart)
                          </button>
                          <button 
                            className={`btn ${pollViewMode === 'bar' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            onClick={() => setPollViewMode('bar')}
                          >
                            📊 長條圖 (Bar Chart)
                          </button>
                        </div>

                        {pollViewMode === 'pie' ? (
                          <div className="glass-card animate-slide-up" style={{ padding: '1.25rem', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.02)' }}>
                            <PieChart stats={stats} options={currentQuestion.options} total={total} />
                          </div>
                        ) : (
                          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {letters.map((letter, idx) => {
                              const count = stats[letter] || 0;
                              const percentage = total > 0 ? (count / total) * 100 : 0;
                              
                              return (
                                <div key={letter} className="chart-bar-container">
                                  <div className="chart-bar-label">
                                    <span>
                                      <strong>Option {letter}</strong>
                                      {currentQuestion.options && currentQuestion.options[idx] && `: ${currentQuestion.options[idx]}`}
                                    </span>
                                    <span>{count} 票 ({percentage.toFixed(0)}%)</span>
                                  </div>
                                  <div className="chart-bar-track">
                                    <div 
                                      className="chart-bar-fill" 
                                      style={{ 
                                        width: `${percentage}%`,
                                        background: 'linear-gradient(90deg, var(--color-indigo) 0%, var(--color-violet) 100%)'
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // CCQ or Game bar charts
                  return (
                    <div>
                      {letters.map((letter, idx) => {
                        const count = stats[letter] || 0;
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        const isCorrect = (currentQuestion.type === 'ccq' || currentQuestion.type === 'game') && currentQuestion.correctAnswer === letter;
                        
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

                {/* Word Cloud Results & Mode Toggle */}
                {currentQuestion.type === 'wordcloud' && (() => {
                  const { sortedList, totalWords, totalSubmissions, submissions } = getWordCloudFrequencies();
                  const maxCount = sortedList.length > 0 ? sortedList[0].count : 1;
                  const minCount = sortedList.length > 0 ? sortedList[sortedList.length - 1].count : 1;
                  const WORD_COLORS = ['#818cf8', '#a78bfa', '#f472b6', '#22d3ee', '#34d399', '#fbbf24', '#60a5fa', '#f87171', '#c084fc', '#38bdf8'];

                  const getFontSize = (count) => {
                    if (maxCount === minCount) return '2.4rem';
                    const ratio = (count - minCount) / (maxCount - minCount);
                    return `${(1.4 + ratio * 3.0).toFixed(2)}rem`;
                  };

                  return (
                    <div>
                      {/* View Mode Toggle Controls */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                        <button 
                          className={`btn ${wordCloudViewMode === 'cloud' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                          onClick={() => setWordCloudViewMode('cloud')}
                        >
                          ☁️ 文字雲 (Word Cloud)
                        </button>
                        <button 
                          className={`btn ${wordCloudViewMode === 'ranking' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                          onClick={() => setWordCloudViewMode('ranking')}
                        >
                          📊 詞頻排行榜 (Ranking)
                        </button>
                        <button 
                          className={`btn ${wordCloudViewMode === 'raw' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                          onClick={() => setWordCloudViewMode('raw')}
                        >
                          💬 學生作答卡片 ({submissions.length})
                        </button>
                      </div>

                      {sortedList.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No word cloud answers submitted.
                        </div>
                      ) : wordCloudViewMode === 'cloud' ? (
                        /* Word Cloud Graphic Display */
                        <div>
                          {/* Hot Keywords Top Bar */}
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                              🔥 最高頻詞彙：
                            </span>
                            {sortedList.slice(0, 5).map((item, idx) => (
                              <span 
                                key={idx} 
                                className="badge animate-pop" 
                                style={{ 
                                  fontSize: '0.9rem', 
                                  padding: '0.3rem 0.75rem',
                                  background: idx === 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                                  borderColor: idx === 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                                  color: idx === 0 ? '#fbbf24' : 'var(--text-primary)'
                                }}
                              >
                                {idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : `#${idx + 1} `}
                                <strong>{item.text}</strong> ({item.count} 次)
                              </span>
                            ))}
                          </div>

                          <div 
                            className="glass-card flex-center wordcloud-container animate-slide-up" 
                            style={{ 
                              minHeight: '300px', 
                              maxHeight: '420px', 
                              overflowY: 'auto',
                              padding: '2.5rem', 
                              background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)',
                              border: '1px solid var(--border-glow)'
                            }}
                          >
                            {sortedList.map((item, idx) => {
                              const color = WORD_COLORS[idx % WORD_COLORS.length];
                              const size = getFontSize(item.count);
                              const isTop = idx === 0 && item.count > 1;

                              return (
                                <span 
                                  key={idx} 
                                  className="wordcloud-tag animate-pop"
                                  style={{ 
                                    fontSize: size,
                                    fontWeight: item.count > 1 ? 700 : 500,
                                    color: color,
                                    textShadow: isTop ? `0 0 24px ${color}aa` : `0 0 10px ${color}44`,
                                    lineHeight: '1.2'
                                  }}
                                  title={`${item.text}: ${item.count} 次提及 (${((item.count / totalWords) * 100).toFixed(1)}%)`}
                                >
                                  {item.text}
                                  {item.count > 1 && (
                                    <sup style={{ fontSize: '0.55em', opacity: 0.85, background: 'rgba(255,255,255,0.12)', padding: '0.1em 0.4em', borderRadius: '10px' }}>
                                      {item.count}
                                    </sup>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ) : wordCloudViewMode === 'ranking' ? (
                        /* Word Frequency Ranking Table */
                        <div className="glass-card" style={{ maxHeight: '350px', overflowY: 'auto', padding: '1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {sortedList.map((item, idx) => {
                              const pct = totalWords > 0 ? (item.count / totalWords) * 100 : 0;
                              return (
                                <div key={idx} className="chart-bar-container" style={{ margin: 0 }}>
                                  <div className="chart-bar-label" style={{ fontSize: '0.9rem' }}>
                                    <span>
                                      <strong>#{idx + 1} {item.text}</strong>
                                    </span>
                                    <span>{item.count} 次 ({pct.toFixed(0)}%)</span>
                                  </div>
                                  <div className="chart-bar-track" style={{ height: '8px' }}>
                                    <div 
                                      className="chart-bar-fill" 
                                      style={{ 
                                        width: `${pct}%`,
                                        background: idx === 0 
                                          ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)' 
                                          : 'linear-gradient(90deg, var(--color-indigo) 0%, var(--color-violet) 100%)'
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* Raw Student Submissions */
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
                          {submissions.map((sub, idx) => (
                            <div key={idx} className="glass-card animate-pop" style={{ padding: '1rem', border: '1px solid var(--border-light)' }}>
                              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--color-indigo)' }}>
                                "{sub.text}"
                              </p>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                                — {sub.studentName}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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

                {/* Pair Discussion Results Review */}
                {currentQuestion.type === 'pair' && (() => {
                  const pairs = getPairDiscussions();
                  const filtered = pairSearchQuery.trim()
                    ? pairs.filter(p => 
                        p.studentName.toLowerCase().includes(pairSearchQuery.toLowerCase()) ||
                        p.partnerName.toLowerCase().includes(pairSearchQuery.toLowerCase()) ||
                        p.summary.toLowerCase().includes(pairSearchQuery.toLowerCase())
                      )
                    : pairs;

                  return (
                    <div>
                      {currentQuestion.description && (
                        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: 'rgba(6, 182, 212, 0.05)', borderColor: 'rgba(6, 182, 212, 0.25)', borderRadius: '12px' }}>
                          <h4 style={{ color: '#22d3ee', fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Users size={18} /> 雙人討論題目與引導任務：
                          </h4>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            <FormattedMarkdown text={currentQuestion.description} />
                          </div>
                        </div>
                      )}

                      <div className="flex-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Users size={20} style={{ color: '#06b6d4' }} />
                          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                            全班雙人討論成果彙整 ({pairs.length} 組繳交)
                          </h3>
                        </div>
                        <input 
                          type="text"
                          placeholder="搜尋學生/夥伴/關鍵字..."
                          className="input-field"
                          style={{ maxWidth: '240px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          value={pairSearchQuery}
                          onChange={(e) => setPairSearchQuery(e.target.value)}
                        />
                      </div>

                      {filtered.length === 0 ? (
                        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          未找到符合的雙人討論紀錄。
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                          {filtered.map((item, idx) => (
                            <div 
                              key={idx}
                              className="glass-card animate-pop"
                              style={{ 
                                padding: '1.25rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer'
                              }}
                              onClick={() => setSpotlightPair(item)}
                              title="點擊全螢幕放大"
                            >
                              <div>
                                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                                  <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', fontSize: '0.85rem' }}>
                                    👥 {item.studentName} {item.partnerName ? `& ${item.partnerName}` : ''}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{idx + 1}</span>
                                </div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6', wordBreak: 'break-word' }}>
                                  <FormattedMarkdown text={item.summary} />
                                </div>
                              </div>
                              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                <span style={{ fontSize: '0.75rem', color: '#22d3ee', opacity: 0.85 }}>🔍 點擊聚焦放大</span>
                              </div>
                            </div>
                          ))}
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

              {/* Right Column: Game Leaderboard (Prominent) OR Student Submissions */}
              {currentQuestion.type === 'game' ? (
                <div 
                  className="glass-card animate-slide-up" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    maxHeight: '480px',
                    border: '1.5px solid rgba(245, 158, 11, 0.45)',
                    boxShadow: '0 8px 32px rgba(245, 158, 11, 0.18)',
                    background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    padding: '1.25rem'
                  }}
                >
                  <div className="flex-between" style={{ borderBottom: '1px solid rgba(245, 158, 11, 0.35)', paddingBottom: '0.75rem', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={24} /> 🏆 即時積分排行榜 (Leaderboard)
                      </h3>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        答對且越快得分越高！每題結束名次即時洗牌
                      </p>
                    </div>
                    <span className="badge badge-warning" style={{ fontWeight: 800, fontSize: '0.85rem' }}>
                      第 {currentQIndex + 1} / {activity.questions.length} 題
                    </span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem', paddingRight: '0.25rem' }}>
                    {getSortedScoreboard().map((p, idx) => {
                      const gainInfo = roundScores[p.name];
                      const gained = gainInfo?.gained || 0;
                      const isCorrect = gainInfo?.isCorrect || false;
                      const elapsed = gainInfo?.elapsedSec;
                      const topScore = getSortedScoreboard()[0]?.score || 1;
                      const barWidth = Math.max(10, Math.min(100, (p.score / (topScore || 1)) * 100));

                      const isGold = idx === 0;
                      const isSilver = idx === 1;
                      const isBronze = idx === 2;

                      return (
                        <div 
                          key={idx} 
                          className="glass-card animate-pop" 
                          style={{ 
                            padding: '0.65rem 0.9rem', 
                            borderRadius: '12px',
                            background: isGold 
                              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.32) 100%)' 
                              : (isSilver 
                                ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.18) 0%, rgba(100, 116, 139, 0.25) 100%)'
                                : (isBronze 
                                  ? 'linear-gradient(135deg, rgba(180, 83, 9, 0.18) 0%, rgba(146, 64, 14, 0.25) 100%)'
                                  : 'rgba(255, 255, 255, 0.03)')),
                            border: isGold 
                              ? '1.5px solid #f59e0b' 
                              : (isSilver 
                                ? '1.5px solid #94a3b8' 
                                : (isBronze 
                                  ? '1.5px solid #b45309' 
                                  : '1px solid rgba(255, 255, 255, 0.05)')),
                            boxShadow: isGold ? '0 0 16px rgba(245, 158, 11, 0.3)' : 'none',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Background score progress track */}
                          <div 
                            style={{ 
                              position: 'absolute', 
                              left: 0, 
                              top: 0, 
                              bottom: 0, 
                              width: `${barWidth}%`, 
                              background: isGold 
                                ? 'rgba(245, 158, 11, 0.1)' 
                                : 'rgba(255, 255, 255, 0.03)',
                              zIndex: 0,
                              pointerEvents: 'none',
                              borderRadius: '12px'
                            }} 
                          />

                          <div className="flex-between" style={{ position: 'relative', zIndex: 1, alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span 
                                style={{ 
                                  fontSize: isGold ? '1.2rem' : '0.95rem',
                                  fontWeight: 800,
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: isGold ? '#f59e0b' : (isSilver ? '#94a3b8' : (isBronze ? '#b45309' : 'rgba(255,255,255,0.08)')),
                                  color: (isGold || isSilver || isBronze) ? '#080B11' : 'var(--text-secondary)',
                                  boxShadow: isGold ? '0 0 12px rgba(245, 158, 11, 0.6)' : 'none'
                                }}
                              >
                                {isGold ? '👑' : (isSilver ? '2' : (isBronze ? '3' : `#${idx + 1}`))}
                              </span>

                              <div>
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: isGold ? '#fef08a' : 'var(--text-primary)' }}>
                                  {p.name}
                                </div>
                                <div style={{ fontSize: '0.78rem', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                  {isCorrect ? (
                                    <span style={{ color: '#10b981', fontWeight: 700 }}>
                                      +{gained} pts
                                    </span>
                                  ) : gainInfo?.hasAnswered ? (
                                    <span style={{ color: '#f87171', fontWeight: 700 }}>
                                      -300 pts (答錯)
                                    </span>
                                  ) : (
                                    <span style={{ color: 'var(--text-muted)' }}>
                                      0 pts (未作答)
                                    </span>
                                  )}

                                  {/* Subtly show response time */}
                                  {elapsed && (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', opacity: 0.75 }}>
                                      • ⏱️ {elapsed}s
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>
                                {p.score.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>pts</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Regular Student Submissions for CCQ, Poll, Ordering, Short, WordCloud, Pair */
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '350px' }}>
                  <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                      Student Submissions ({joinedStudents.length})
                    </h3>
                    {(currentQuestion.type === 'ccq' || currentQuestion.type === 'ordering') && (() => {
                      const answeredCount = Object.keys(answers).length;
                      let correctCount = 0;
                      if (currentQuestion.type === 'ordering') {
                        correctCount = Object.values(answers).filter(a => a.questionIndex === currentQIndex && Array.isArray(a.answer) && a.answer.every((v, i) => v === currentQuestion.items[i])).length;
                      } else {
                        correctCount = Object.values(answers).filter(a => a.questionIndex === currentQIndex && a.answer === currentQuestion.correctAnswer).length;
                      }
                      return (
                        <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>
                          答對率: {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}% ({correctCount}/{answeredCount})
                        </span>
                      );
                    })()}
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {joinedStudents.map((stName, idx) => {
                      const submission = answers[stName];
                      let statusLabel = '未作答 (No Answer)';
                      let isCorrect = false;
                      let hasAnswered = false;
                      
                      if (submission && submission.questionIndex === currentQIndex) {
                        hasAnswered = true;
                        if (currentQuestion.type === 'ccq') {
                          isCorrect = submission.answer === currentQuestion.correctAnswer;
                          statusLabel = isCorrect 
                            ? `🎉 答對！選了 Option ${submission.answer}` 
                            : `❌ 答錯，選了 Option ${submission.answer}`;
                        } else if (currentQuestion.type === 'ordering') {
                          isCorrect = Array.isArray(submission.answer) && submission.answer.every((val, index) => val === currentQuestion.items[index]);
                          statusLabel = isCorrect ? '🎉 排序完全正確！' : '❌ 排序未完全正確';
                        } else if (currentQuestion.type === 'poll') {
                          statusLabel = `已投 Option ${submission.answer}`;
                        } else if (currentQuestion.type === 'pair') {
                          statusLabel = `已提交雙人討論 (夥伴: ${submission.answer?.partnerName || '未填'})`;
                        } else {
                          statusLabel = submission.answer ? '已送出作答' : '未作答';
                        }
                      }

                      return (
                        <div 
                          key={idx} 
                          className="flex-between animate-pop" 
                          style={{ 
                            padding: '0.45rem 0.75rem', 
                            borderRadius: '8px',
                            background: isCorrect 
                              ? 'rgba(16, 185, 129, 0.15)' 
                              : (hasAnswered ? 'rgba(255, 255, 255, 0.02)' : 'rgba(239, 68, 68, 0.05)'),
                            border: isCorrect 
                              ? '1.5px solid rgba(16, 185, 129, 0.6)' 
                              : '1px solid rgba(255, 255, 255, 0.05)',
                            boxShadow: isCorrect ? '0 0 12px rgba(16, 185, 129, 0.2)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{ 
                            fontSize: '0.92rem', 
                            fontWeight: isCorrect ? 700 : 500,
                            color: isCorrect ? '#6ee7b7' : 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}>
                            {isCorrect ? '✅ ' : (hasAnswered ? '👤 ' : '⚪ ')}
                            {stName}
                          </span>
                          <span 
                            className={`badge ${isCorrect ? 'badge-success' : (hasAnswered ? (currentQuestion.type === 'poll' || currentQuestion.type === 'pair' || currentQuestion.type === 'short' || currentQuestion.type === 'wordcloud' ? 'badge-indigo' : 'badge-danger') : 'badge-secondary')}`} 
                            style={{ 
                              fontSize: isCorrect ? '0.85rem' : '0.78rem',
                              padding: isCorrect ? '0.3rem 0.65rem' : '0.25rem 0.5rem',
                              fontWeight: isCorrect ? 700 : 500
                            }}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
                    <div>
                      <div className="podium-container">
                        {/* 2nd Place */}
                        {silver && (
                          <div className="podium-pillar podium-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="podium-avatar">🥈</div>
                            <div className="podium-rank">2</div>
                            <div className="podium-name">{silver.name}</div>
                            <div className="podium-score">{silver.score} pts</div>
                          </div>
                        )}

                        {/* 1st Place */}
                        {gold && (
                          <div className="podium-pillar podium-1 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <div className="podium-avatar">👑 🥇</div>
                            <div className="podium-rank">1</div>
                            <div className="podium-name">{gold.name}</div>
                            <div className="podium-score">{gold.score} pts</div>
                          </div>
                        )}

                        {/* 3rd Place */}
                        {bronze && (
                          <div className="podium-pillar podium-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="podium-avatar">🥉</div>
                            <div className="podium-rank">3</div>
                            <div className="podium-name">{bronze.name}</div>
                            <div className="podium-score">{bronze.score} pts</div>
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

      {/* Toast Notification for Simulation */}
      {simulationToast && (
        <div 
          className="animate-pop"
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #ec4899',
            color: '#f472b6',
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          <FlaskConical size={18} /> {simulationToast}
        </div>
      )}

      {/* Spotlight Pop-up Modal for Pair Discussion */}
      {spotlightPair && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
          onClick={() => setSpotlightPair(null)}
        >
          <div 
            className="glass-card animate-pop"
            style={{
              maxWidth: '750px',
              width: '100%',
              padding: '2.5rem',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(6, 182, 212, 0.5)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              borderRadius: '20px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                  <Users size={16} /> 雙人討論重點聚焦
                </span>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                  {spotlightPair.studentName} {spotlightPair.partnerName ? `& ${spotlightPair.partnerName}` : ''}
                </h3>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                onClick={() => setSpotlightPair(null)}
              >
                ✕ 關閉
              </button>
            </div>

            <div style={{ fontSize: '1.35rem', lineHeight: '1.7', color: '#f8fafc', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
              <FormattedMarkdown text={spotlightPair.summary} />
            </div>

            <div style={{ textAlign: 'right' }}>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.65rem 1.75rem', fontSize: '0.95rem' }}
                onClick={() => setSpotlightPair(null)}
              >
                返回討論成果牆
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="footer-branding" style={{ marginTop: '3rem' }}>
        designed by <span>Nien-Lin Hsueh, Feng Chia University</span>
      </footer>
    </div>
  );
}
