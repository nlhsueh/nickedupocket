import React, { useState, useEffect } from 'react';
import { DEFAULT_SE_MD, DEFAULT_ST_MD } from './utils/demoData';
import { parseMarkdownCourse } from './utils/mdParser';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherSession from './components/TeacherSession';
import StudentSession from './components/StudentSession';

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

  const handleLaunchActivity = (roomCode) => {
    window.location.hash = `#/teacher/${roomCode}`;
  };

  const handleLaunchInstant = ({ roomCode, activityData }) => {
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
  };

  const handleBackToDashboard = () => {
    window.location.hash = '#/';
  };

  // Route views
  if (route.path === 'teacher') {
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
  );
}
