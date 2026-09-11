import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, X } from 'lucide-react';
import { DEFAULT_SE_MD, DEFAULT_ST_MD } from './utils/demoData';
import { parseMarkdownCourse } from './utils/mdParser';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherSession from './components/TeacherSession';
import StudentSession from './components/StudentSession';

// Helper to validate teacher password (accepts both nick007 and Nick007)
export const isTeacherPasswordValid = (pwd) => {
  if (!pwd) return false;
  const trimmed = pwd.trim();
  return trimmed === 'nick007' || trimmed === 'Nick007';
};

// Parse Hash Helper for Static Router
const parseHash = (hash) => {
  if (!hash || hash === '#/') return { path: 'dashboard' };
  
  const cleanHash = hash.replace(/^#/, '');
  const [pathPart, queryStr] = cleanHash.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  
  // Student view: /student/ROOMCODE
  if (parts[0] === 'student' && parts[1]) {
    return { path: 'student', roomCode: parts[1], query: queryStr || '' };
  }
  
  // Teacher session view: /teacher/ROOMCODE
  if (parts[0] === 'teacher' && parts[1]) {
    return { path: 'teacher', roomCode: parts[1], query: queryStr || '' };
  }
  
  return { path: 'dashboard' };
};

// Helper to lookup course/chapter/activity from a given room code (case-insensitive)
const findActivityByRoomCode = (courses, roomCode, instantActivities = {}) => {
  if (!roomCode) return null;
  const cleanCode = roomCode.toLowerCase().trim();
  
  // 1. Check instant activities created on the fly
  if (instantActivities) {
    for (const [key, act] of Object.entries(instantActivities)) {
      const actKey = key.toLowerCase();
      if (cleanCode === actKey || cleanCode.endsWith(`-${actKey}`)) {
        return {
          course: { id: 'instant_course', courseTitle: '⚡ 課堂即時題目' },
          chapter: { id: 'instant_chap', title: '即時互動' },
          activity: act
        };
      }
    }
  }

  // 2. Check course markdown chapters
  for (const course of courses) {
    if (!course.chapters) continue;
    for (const chap of course.chapters) {
      if (!chap.activities) continue;
      for (const act of chap.activities) {
        const actId = act.id.toLowerCase();
        // Match exact Activity ID OR check if roomCode ends with -activityId (ignoring teacher prefix)
        if (cleanCode === actId || cleanCode.endsWith(`-${actId}`)) {
          return { course, chapter: chap, activity: act };
        }
      }
    }
  }
  return null;
};

export default function App() {
  const [defaultCourses, setDefaultCourses] = useState([]);
  const [customCourses, setCustomCourses] = useState(() => {
    const saved = localStorage.getItem('nickpocket_custom_courses');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Instant in-class activities (in-memory / sessionStorage, no file persistence)
  const [instantActivities, setInstantActivities] = useState(() => {
    try {
      const saved = sessionStorage.getItem('nickpocket_instant_activities');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  // 1. Fetch default courses on mount
  useEffect(() => {
    const loadDefaultCourses = async () => {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const courseFiles = [
        { id: 'gTeachSQA', file: 'gTeachSQA.md', fallback: DEFAULT_ST_MD },
        { id: 'gTeachASE', file: 'gTeachASE.md', fallback: DEFAULT_SE_MD },
        { id: 'gTeachPython', file: 'gTeachPython.md', fallback: null },
        { id: 'gTeachUX', file: 'gTeachUX.md', fallback: null },
        { id: 'gJustTest', file: 'gJustTest.md', fallback: null },
        { id: 'gNickClass', file: 'gNickClass.md', fallback: null },
      ];

      const loaded = [];
      for (const item of courseFiles) {
        try {
          const res = await fetch(`${baseUrl}courses/${item.file}?t=${Date.now()}`, { cache: 'no-store' });
          if (!res.ok) throw new Error('Fetch status ' + res.status);
          const text = await res.text();
          const parsed = parseMarkdownCourse(text, item.id);
          if (parsed && parsed.chapters && parsed.chapters.length > 0) {
            loaded.push(parsed);
          }
        } catch (e) {
          if (item.fallback) {
            loaded.push(parseMarkdownCourse(item.fallback, item.id));
          }
        }
      }

      setDefaultCourses(loaded);
    };

    loadDefaultCourses();
  }, []);

  // 2. Routing listener
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const allCourses = [...defaultCourses, ...customCourses];

  const [isTeacherAuth, setIsTeacherAuth] = useState(
    () => sessionStorage.getItem('nickpocket_teacher_auth') === 'true'
  );
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showRoutePwdText, setShowRoutePwdText] = useState(false);

  // Modal-based masked password prompt (replaces prompt() so input is hidden with asterisks)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [modalPwd, setModalPwd] = useState('');
  const [modalPwdError, setModalPwdError] = useState(false);
  const [showModalPwdText, setShowModalPwdText] = useState(false);

  const requestTeacherAuth = (actionCallback) => {
    if (sessionStorage.getItem('nickpocket_teacher_auth') === 'true' || isTeacherAuth) {
      actionCallback();
      return;
    }
    setPendingAction(() => actionCallback);
    setModalPwd('');
    setModalPwdError(false);
    setShowModalPwdText(false);
    setShowAuthModal(true);
  };

  const handleModalAuthSubmit = (e) => {
    if (e) e.preventDefault();
    if (isTeacherPasswordValid(modalPwd)) {
      sessionStorage.setItem('nickpocket_teacher_auth', 'true');
      setIsTeacherAuth(true);
      setShowAuthModal(false);
      setModalPwdError(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setModalPwdError(true);
    }
  };

  const handleLaunchActivity = (roomCode) => {
    requestTeacherAuth(() => {
      window.location.hash = `#/teacher/${roomCode}`;
    });
  };

  const handleLaunchInstant = ({ roomCode, activityData }) => {
    requestTeacherAuth(() => {
      setInstantActivities(prev => {
        const next = { ...prev, [activityData.id]: activityData, [roomCode]: activityData };
        try {
          sessionStorage.setItem('nickpocket_instant_activities', JSON.stringify(next));
        } catch (e) {
          console.warn('Failed to save instant activity to sessionStorage:', e);
        }
        return next;
      });
      window.location.hash = `#/teacher/${roomCode}`;
    });
  };

  const handleBackToDashboard = () => {
    window.location.hash = '#/';
  };

  // Route views
  if (route.path === 'teacher') {
    if (!isTeacherAuth && sessionStorage.getItem('nickpocket_teacher_auth') !== 'true') {
      const handleAuthSubmit = (e) => {
        e.preventDefault();
        if (isTeacherPasswordValid(authInput)) {
          sessionStorage.setItem('nickpocket_teacher_auth', 'true');
          setIsTeacherAuth(true);
          setAuthError(false);
        } else {
          setAuthError(true);
        }
      };

      return (
        <div className="container animate-slide-up flex-center" style={{ minHeight: '80vh', flexDirection: 'column', textAlign: 'center' }}>
          <div className="glass-card animate-pop" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-indigo)' }}>
              <Lock size={30} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                教師管理密碼驗證
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                此為課堂主持控制介面，請輸入教師密碼以啟動並主持活動（支援 nick007 或 Nick007）。
              </p>
            </div>
            <form onSubmit={handleAuthSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showRoutePwdText ? 'text' : 'password'}
                  className="input-field"
                  placeholder="請輸入教師密碼..."
                  value={authInput}
                  onChange={(e) => {
                    setAuthInput(e.target.value);
                    setAuthError(false);
                  }}
                  autoFocus
                  style={{ 
                    width: '100%', 
                    padding: '0.8rem 2.75rem 0.8rem 1rem', 
                    textAlign: 'center', 
                    fontSize: '1.1rem', 
                    letterSpacing: showRoutePwdText ? '1px' : '4px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowRoutePwdText(!showRoutePwdText)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showRoutePwdText ? '隱藏密碼 (*)' : '顯示密碼'}
                >
                  {showRoutePwdText ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {authError && (
                <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', fontWeight: 500 }}>
                  密碼錯誤，請重新輸入！（支援 nick007 或 Nick007）
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
                驗證並進入活動
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}
                onClick={handleBackToDashboard}
              >
                返回儀表板
              </button>
            </form>
          </div>
        </div>
      );
    }
    const match = findActivityByRoomCode(allCourses, route.roomCode, instantActivities);
    
    if (!match) {
      return (
        <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
          <h2>Activity Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            The activity code <strong>{route.roomCode}</strong> does not match any parsed markdown activity ID.
          </p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleBackToDashboard}>
            Go Back to Dashboard
          </button>
        </div>
      );
    }

    const { course, chapter, activity } = match;
    const sessionActivity = {
      ...activity,
      title: activity.isInstant ? activity.title : `${course.courseTitle} - ${activity.title}`,
      courseId: course.id
    };

    return (
      <TeacherSession 
        activity={sessionActivity} 
        roomCode={route.roomCode} 
        onBack={handleBackToDashboard} 
        onLaunchInstant={handleLaunchInstant}
      />
    );
  }

  if (route.path === 'student') {
    const match = findActivityByRoomCode(allCourses, route.roomCode, instantActivities);
    return (
      <StudentSession 
        roomCode={route.roomCode} 
        onLeave={handleBackToDashboard} 
        activity={match ? match.activity : null}
        course={match ? match.course : null}
        chapter={match ? match.chapter : null}
        courses={allCourses}
        isPreview={route.query?.includes('preview=true')}
      />
    );
  }

  return (
    <>
      <TeacherDashboard 
        courses={allCourses} 
        customCourses={customCourses}
        setCustomCourses={setCustomCourses} 
        onLaunch={handleLaunchActivity} 
        onLaunchInstant={handleLaunchInstant}
        selectedCourseId={selectedCourseId}
        setSelectedCourseId={setSelectedCourseId}
        selectedChapterId={selectedChapterId}
        setSelectedChapterId={setSelectedChapterId}
        selectedActivityId={selectedActivityId}
        setSelectedActivityId={setSelectedActivityId}
      />

      {/* Teacher Password Prompt Modal */}
      {showAuthModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div 
            className="glass-card animate-pop" 
            style={{ 
              maxWidth: '420px', 
              width: '100%', 
              padding: '2.25rem 1.75rem', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1.25rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              position: 'relative',
              background: 'var(--card-bg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="關閉"
            >
              <X size={20} />
            </button>

            <div style={{ width: '58px', height: '58px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-indigo)' }}>
              <Lock size={28} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: 700 }}>
                教師管理密碼驗證
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                請輸入密碼以啟動活動（密碼預設以 * 遮罩保護）
              </p>
            </div>

            <form onSubmit={handleModalAuthSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showModalPwdText ? 'text' : 'password'}
                  className="input-field"
                  placeholder="請輸入教師密碼..."
                  value={modalPwd}
                  onChange={(e) => {
                    setModalPwd(e.target.value);
                    setModalPwdError(false);
                  }}
                  autoFocus
                  style={{ 
                    width: '100%', 
                    padding: '0.8rem 2.75rem 0.8rem 1rem', 
                    textAlign: 'center', 
                    fontSize: '1.15rem', 
                    letterSpacing: showModalPwdText ? '1px' : '4px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowModalPwdText(!showModalPwdText)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showModalPwdText ? '隱藏密碼 (*)' : '顯示密碼'}
                >
                  {showModalPwdText ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {modalPwdError && (
                <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center' }}>
                  密碼錯誤，請重新輸入！（支援 nick007 或 Nick007）
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.35rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.8rem' }}
                  onClick={() => setShowAuthModal(false)}
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 2, padding: '0.8rem' }}
                >
                  驗證並啟動
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
