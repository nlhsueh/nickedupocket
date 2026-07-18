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
    return { path: 'student', roomCode: parts[1].toUpperCase() };
  }
  
  // Teacher session view: /teacher/ROOMCODE/courseId/chapterId
  if (parts[0] === 'teacher' && parts[1] && parts[2] && parts[3]) {
    return { 
      path: 'teacher', 
      roomCode: parts[1].toUpperCase(), 
      courseId: parts[2],
      chapterId: parts[3]
    };
  }
  
  return { path: 'dashboard' };
};

// Room Code Generator
const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
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

  // Combine default and custom courses
  const allCourses = [...defaultCourses, ...customCourses];

  const handleLaunchChapter = (courseId, chapterId) => {
    const code = generateRoomCode();
    window.location.hash = `#/teacher/${code}/${courseId}/${chapterId}`;
  };

  const handleBackToDashboard = () => {
    window.location.hash = '#/';
  };

  // Route views
  if (route.path === 'teacher') {
    const course = allCourses.find(c => c.id === route.courseId);
    const chapter = course?.chapters?.find(ch => ch.id === route.chapterId);
    
    if (!course || !chapter) {
      return (
        <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
          <h2>Course or Chapter Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>The requested session template could not be loaded.</p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleBackToDashboard}>
            Go Back to Dashboard
          </button>
        </div>
      );
    }
    
    // We pass the chapter as the "activity" object. In the session, the activity's questions are executed.
    // We add the course title for branding/header display inside the session.
    const sessionActivity = {
      ...chapter,
      title: `${course.courseTitle} - ${chapter.title}`,
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
      onLaunch={handleLaunchChapter} 
    />
  );
}
