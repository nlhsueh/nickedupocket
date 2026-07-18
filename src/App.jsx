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
  const parts = cleanHash.split('/').filter(Boolean);
  
  // Student view: /student/ROOMCODE
  if (parts[0] === 'student' && parts[1]) {
    return { path: 'student', roomCode: parts[1] };
  }
  
  // Teacher session view: /teacher/ROOMCODE
  if (parts[0] === 'teacher' && parts[1]) {
    return { path: 'teacher', roomCode: parts[1] };
  }
  
  return { path: 'dashboard' };
};

// Helper to lookup course/chapter/activity from a given room code (case-insensitive)
const findActivityByRoomCode = (courses, roomCode) => {
  if (!roomCode) return null;
  const cleanCode = roomCode.toLowerCase().trim();
  
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
  
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  // 1. Fetch default courses on mount
  useEffect(() => {
    const loadDefaultCourses = async () => {
      const baseUrl = import.meta.env.BASE_URL || '/';
      let seCourse, stCourse;

      try {
        const res = await fetch(`${baseUrl}courses/software_eng.md`);
        if (!res.ok) throw new Error('Fetch status ' + res.status);
        const text = await res.text();
        seCourse = parseMarkdownCourse(text, 'software_eng');
      } catch (e) {
        console.warn('Failed to fetch software_eng.md, loading fallback...', e);
        seCourse = parseMarkdownCourse(DEFAULT_SE_MD, 'software_eng');
      }

      try {
        const res = await fetch(`${baseUrl}courses/software_testing.md`);
        if (!res.ok) throw new Error('Fetch status ' + res.status);
        const text = await res.text();
        stCourse = parseMarkdownCourse(text, 'software_testing');
      } catch (e) {
        console.warn('Failed to fetch software_testing.md, loading fallback...', e);
        stCourse = parseMarkdownCourse(DEFAULT_ST_MD, 'software_testing');
      }

      setDefaultCourses([seCourse, stCourse]);
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

  const handleBackToDashboard = () => {
    window.location.hash = '#/';
  };

  // Route views
  if (route.path === 'teacher') {
    const match = findActivityByRoomCode(allCourses, route.roomCode);
    
    if (!match) {
      return (
        <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
          <h2>Activity Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            The room code <strong>{route.roomCode}</strong> does not match any parsed markdown activity ID.
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
      title: `${course.courseTitle} - ${activity.title}`,
      courseId: course.id
    };

    return (
      <TeacherSession 
        activity={sessionActivity} 
        roomCode={route.roomCode} 
        onBack={handleBackToDashboard} 
      />
    );
  }

  if (route.path === 'student') {
    return (
      <StudentSession 
        roomCode={route.roomCode} 
        onLeave={handleBackToDashboard} 
      />
    );
  }

  return (
    <TeacherDashboard 
      courses={allCourses} 
      customCourses={customCourses}
      setCustomCourses={setCustomCourses} 
      onLaunch={handleLaunchActivity} 
    />
  );
}
