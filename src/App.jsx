import React, { useState, useEffect } from 'react';
import { DEFAULT_ACTIVITIES } from './utils/demoData';
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
  
  // Teacher session view: /teacher/ROOMCODE/activityId
  if (parts[0] === 'teacher' && parts[1] && parts[2]) {
    return { path: 'teacher', roomCode: parts[1].toUpperCase(), activityId: parts[2] };
  }
  
  return { path: 'dashboard' };
};

// Room Code Generator (omit ambiguous letters/numbers)
const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function App() {
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('nickpocket_activities');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITIES;
  });

  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  // Listen to hash change routing events
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Launch a session from Teacher Dashboard
  const handleLaunchActivity = (activity) => {
    const code = generateRoomCode();
    window.location.hash = `#/teacher/${code}/${activity.id}`;
  };

  // Exit activity views and return to dashboard
  const handleBackToDashboard = () => {
    window.location.hash = '#/';
  };

  // Route Rendering
  if (route.path === 'teacher') {
    const activeActivity = activities.find(a => a.id === route.activityId);
    if (!activeActivity) {
      return (
        <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
          <h2>Activity Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>The requested activity template could not be loaded.</p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleBackToDashboard}>
            Go Back to Dashboard
          </button>
        </div>
      );
    }
    return (
      <TeacherSession 
        activity={activeActivity} 
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

  // Fallback: Teacher Dashboard
  return (
    <TeacherDashboard 
      activities={activities} 
      setActivities={setActivities} 
      onLaunch={handleLaunchActivity} 
    />
  );
}
