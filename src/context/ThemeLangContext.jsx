import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sun, Moon, Globe } from 'lucide-react';

export const translations = {
  zh: {
    // App & Common
    appName: 'NickPocketEdu',
    appSubtitle: '高互動課堂問答與即時反饋系統',
    back: '返回',
    returnToApp: '返回 NickPocketEdu',
    close: '關閉',
    submit: '提交',
    confirm: '確認',
    cancel: '取消',
    save: '儲存',
    copy: '複製',
    copied: '已複製！',
    loading: '載入中...',
    online: '連線正常',
    offline: '離線中',
    themeDark: '夜間模式',
    themeLight: '日間模式',
    langZh: '繁體中文',
    langEn: 'English',
    themeToggleHint: '切換日間／夜間模式',
    langToggleHint: '切換中英文 (Switch Language)',

    // Teacher Dashboard
    courseLibrary: '互動課程庫',
    allCourses: '全部課程',
    chapters: '章節進度',
    activities: '互動題型活動',
    launchActivity: '啟動互動房間 (Launch)',
    copyRoomLink: '複製學生邀請連結',
    viewQR: '顯示教室投影 QR Code',
    importCourse: '匯入 Markdown 課程',
    studentCount: '已加入學生',
    previewQuestions: '題目預覽',
    searchCourses: '搜尋課程或題型...',
    quickTestCourse: 'JustTest 快速測試課程',
    activeRooms: '目前進行中的活動房間',
    noActivitiesFound: '此章節尚無互動題型',

    // Teacher Session
    lobbyTitle: '等待學生加入',
    roomCode: '房間代碼',
    scanToJoin: '手機掃描 QR Code 或輸入房間代碼加入',
    directLink: '或由學生端直接瀏覽器開啟：',
    startQuestion: '開始作答 (Start)',
    stopAnswering: '截止作答 (Stop)',
    simulateStudents: '模擬 10 人作答',
    simulateHint: '模擬 10 位學生 (st01~st10) 作答',
    nextAndStart: '下一題並立即搶答',
    viewPodium: '🏆 揭曉最終冠軍頒獎台',
    finishSurvey: '完成問卷調查 (Finish Survey)',
    exportCSV: '匯出 CSV',
    printPDF: '列印 / 儲存 PDF',
    answeringStopped: '作答已截止',
    questionResults: '作答結果統計',
    correctAnswer: '正確答案',
    allQuestionsOverview: '📊 全部題目一覽 (All)',
    surveyResultsOverview: '問卷統計總覽',
    surveyResponses: '份回收',
    openFeedbackWall: '💬 全班開放式回饋成果牆',
    openFeedbackCount: '位同學填寫',
    pieChart: '🥧 圓餅圖 (Pie Chart)',
    barChart: '📊 長條圖 (Bar Chart)',
    rankingList: '錦標賽即時榜單',
    studentsAnswered: '位學生已作答',
    viewDetails: '點擊查看答案與解析',

    // Student Session
    enterNickname: '請輸入你的姓名或代號',
    anonymousToggle: '點我改用匿名模式',
    anonymousActive: '目前處於匿名模式',
    switchAnonNumber: '換個匿名代號',
    nicknamePlaceholder: '例如：陳小明、Alex',
    joinRoom: '加入課堂活動 (Join)',
    waitingTeacher: '等待老師開始題目...',
    roomClosed: '房間已關閉或尚未開啟',
    submitAnswer: '送出答案 (Submit)',
    submitSurvey: '🚀 提交整份問卷 (Submit Survey)',
    surveyProgress: '必填選擇題進度',
    surveyRequiredNotice: '請完成所有必填選擇題',
    openEndedPrompt: '✍️ 開放問答題（選填）',
    openEndedPlaceholder: '請在此輸入你的想法、期許或建議（選填）...',
    charsLeft: '還可輸入',
    chars: '字',
    correctBadge: '🎉 恭喜答對！',
    wrongBadge: '❌ 很可惜答錯了',
    yourRank: '目前全班排名',
    yourScore: '目前累計積分',
    wordCloudPlaceholder: '輸入關鍵詞後按 Enter 送出',
    pairDiscussionTitle: '雙人小組配對與即時討論',
    pairSummaryPlaceholder: '請輸入你們討論後的共同觀點或總結（10~300 字）...',
    orderingInstruction: '請拖曳或點選箭頭調整正確先後順序'
  },
  en: {
    // App & Common
    appName: 'NickPocketEdu',
    appSubtitle: 'Interactive Classroom Polling & Response System',
    back: 'Back',
    returnToApp: 'Back to NickPocketEdu',
    close: 'Close',
    submit: 'Submit',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    copy: 'Copy',
    copied: 'Copied!',
    loading: 'Loading...',
    online: 'Online',
    offline: 'Offline',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    langZh: '繁體中文',
    langEn: 'English',
    themeToggleHint: 'Toggle Light / Dark Mode',
    langToggleHint: 'Switch Language (切換語言)',

    // Teacher Dashboard
    courseLibrary: 'Course Library',
    allCourses: 'All Courses',
    chapters: 'Chapters',
    activities: 'Interactive Activities',
    launchActivity: 'Launch Activity Room',
    copyRoomLink: 'Copy Student Invite Link',
    viewQR: 'Display Projector QR Code',
    importCourse: 'Import Markdown Course',
    studentCount: 'Joined Students',
    previewQuestions: 'Question Preview',
    searchCourses: 'Search courses or activities...',
    quickTestCourse: 'JustTest Quick Test Suite',
    activeRooms: 'Active Rooms',
    noActivitiesFound: 'No activities in this chapter',

    // Teacher Session
    lobbyTitle: 'Waiting for Students',
    roomCode: 'Room Code',
    scanToJoin: 'Scan QR Code or enter code to join',
    directLink: 'Or direct student browser link:',
    startQuestion: 'Start Answering',
    stopAnswering: 'Stop Answering',
    simulateStudents: 'Simulate 10 Students',
    simulateHint: 'Simulate 10 students (st01~st10) answering',
    nextAndStart: 'Next & Start Timer',
    viewPodium: '🏆 View Final Podium',
    finishSurvey: 'Finish Survey',
    exportCSV: 'Export CSV',
    printPDF: 'Print / Save PDF',
    answeringStopped: 'Answering Stopped',
    questionResults: 'Question Results',
    correctAnswer: 'Correct Answer',
    allQuestionsOverview: '📊 All Questions Overview',
    surveyResultsOverview: 'Survey Results Overview',
    surveyResponses: 'responses',
    openFeedbackWall: '💬 Class Open Feedback Wall',
    openFeedbackCount: 'students responded',
    pieChart: '🥧 Pie Chart',
    barChart: '📊 Bar Chart',
    rankingList: 'Tournament Live Leaderboard',
    studentsAnswered: 'students answered',
    viewDetails: 'Click to view explanation',

    // Student Session
    enterNickname: 'Enter your name or nickname',
    anonymousToggle: 'Use Anonymous Mode',
    anonymousActive: 'Currently in Anonymous Mode',
    switchAnonNumber: 'Shuffle Anonymous Code',
    nicknamePlaceholder: 'e.g., Alex, Jordan',
    joinRoom: 'Join Room',
    waitingTeacher: 'Waiting for instructor to start...',
    roomClosed: 'Room is closed or not started',
    submitAnswer: 'Submit Answer',
    submitSurvey: '🚀 Submit Survey',
    surveyProgress: 'Required choices progress',
    surveyRequiredNotice: 'Please complete all required choice questions',
    openEndedPrompt: '✍️ Open-ended Feedback (Optional)',
    openEndedPlaceholder: 'Enter your thoughts, expectations, or suggestions...',
    charsLeft: 'Remaining',
    chars: 'chars',
    correctBadge: '🎉 Correct Answer!',
    wrongBadge: '❌ Incorrect',
    yourRank: 'Current Rank',
    yourScore: 'Current Total Score',
    wordCloudPlaceholder: 'Type keyword and press Enter',
    pairDiscussionTitle: 'Pair Discussion & Matching',
    pairSummaryPlaceholder: 'Enter your shared summary or takeaways (10~300 chars)...',
    orderingInstruction: 'Drag or click arrows to reorder items correctly'
  }
};

const ThemeLangContext = createContext({
  theme: 'dark',
  lang: 'zh',
  toggleTheme: () => {},
  toggleLang: () => {},
  t: (key) => key
});

export const ThemeLangProvider = ({ children }) => {
  // Theme state (default: 'dark')
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('nickpocket_theme') || 'dark';
  });

  // Language state (default: 'zh')
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('nickpocket_lang') || 'zh';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nickpocket_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nickpocket_lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLang = () => {
    setLangState(prev => (prev === 'zh' ? 'en' : 'zh'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['zh']?.[key] || key;
  };

  return (
    <ThemeLangContext.Provider value={{ theme, lang, toggleTheme, toggleLang, t }}>
      {children}
    </ThemeLangContext.Provider>
  );
};

export const useThemeLang = () => useContext(ThemeLangContext);

export const ThemeLangControls = ({ className = '', style = {} }) => {
  const { theme, lang, toggleTheme, toggleLang, t } = useThemeLang();

  return (
    <div 
      className={`theme-lang-controls no-print ${className}`} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.4rem', 
        background: 'var(--btn-secondary-bg)', 
        border: '1px solid var(--border-light)', 
        borderRadius: '9999px', 
        padding: '0.2rem 0.35rem',
        ...style 
      }}
    >
      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className="btn-theme-toggle"
        style={{
          border: 'none',
          background: 'transparent',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          padding: '0.35rem 0.55rem',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }}
        title={t('themeToggleHint')}
      >
        {theme === 'dark' ? (
          <>
            <Moon size={14} style={{ color: '#818cf8' }} />
            <span style={{ fontSize: '0.76rem' }}>夜間</span>
          </>
        ) : (
          <>
            <Sun size={14} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.76rem' }}>日間</span>
          </>
        )}
      </button>

      <span style={{ color: 'var(--border-light)', fontSize: '0.8rem' }}>|</span>

      {/* Language Toggle Button */}
      <button
        type="button"
        onClick={toggleLang}
        className="btn-lang-toggle"
        style={{
          border: 'none',
          background: 'transparent',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          padding: '0.35rem 0.55rem',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }}
        title={t('langToggleHint')}
      >
        <Globe size={14} style={{ color: 'var(--color-indigo)' }} />
        <span style={{ fontSize: '0.76rem' }}>{lang === 'zh' ? '中' : 'EN'}</span>
      </button>
    </div>
  );
};
