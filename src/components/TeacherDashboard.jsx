import React, { useState, useEffect } from 'react';
import { 
  Play, Book, FileText, ChevronRight, ChevronLeft, Trash2, 
  Upload, HelpCircle, BarChart2, ListOrdered, Gamepad2, AlertCircle, Copy, Check
} from 'lucide-react';
import { parseMarkdownCourse } from '../utils/mdParser';

export default function TeacherDashboard({ courses, customCourses, setCustomCourses, onLaunch }) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Teacher ID Prefix to prevent broker topic collisions
  const [teacherPrefix, setTeacherPrefix] = useState(() => {
    return localStorage.getItem('nickpocket_teacher_prefix') || '';
  });

  const handlePrefixChange = (val) => {
    const clean = val.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 15);
    setTeacherPrefix(clean);
    localStorage.setItem('nickpocket_teacher_prefix', clean);
  };

  // Find currently selected course, chapter, activity
  const currentCourse = courses.find(c => c.id === selectedCourseId);
  const currentChapter = currentCourse?.chapters?.find(ch => ch.id === selectedChapterId);
  const currentActivity = currentChapter?.activities?.find(act => act.id === selectedActivityId);

  // Markdown uploader handlers
  const handleMarkdownUpload = (file) => {
    if (!file) return;
    
    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      alert('Please upload a standard Markdown (.md) file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const fileId = `custom_${Date.now()}`;
        const parsedCourse = parseMarkdownCourse(text, fileId);
        
        if (parsedCourse.chapters.length === 0) {
          alert('No chapters (## Chapter Title) found in the markdown file.');
          return;
        }

        const nextCustom = [parsedCourse, ...customCourses.filter(c => c.courseTitle !== parsedCourse.courseTitle)];
        setCustomCourses(nextCustom);
        localStorage.setItem('nickpocket_custom_courses', JSON.stringify(nextCustom));
        setSelectedCourseId(parsedCourse.id);
        
        if (parsedCourse.chapters[0]) {
          setSelectedChapterId(parsedCourse.chapters[0].id);
          if (parsedCourse.chapters[0].activities[0]) {
            setSelectedActivityId(parsedCourse.chapters[0].activities[0].id);
          }
        }
        alert(`Successfully imported "${parsedCourse.courseTitle}" with ${parsedCourse.chapters.length} chapters!`);
      } catch (err) {
        alert('Failed to parse Markdown file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleMarkdownUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleMarkdownUpload(e.dataTransfer.files[0]);
    }
  };

  const deleteCustomCourse = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this custom course?')) {
      const nextCustom = customCourses.filter(c => c.id !== id);
      setCustomCourses(nextCustom);
      localStorage.setItem('nickpocket_custom_courses', JSON.stringify(nextCustom));
      if (selectedCourseId === id) {
        setSelectedCourseId(null);
        setSelectedChapterId(null);
        setSelectedActivityId(null);
      }
    }
  };

  const clearAllCustom = () => {
    if (window.confirm('Delete all custom uploaded courses?')) {
      setCustomCourses([]);
      localStorage.removeItem('nickpocket_custom_courses');
      setSelectedCourseId(null);
      setSelectedChapterId(null);
      setSelectedActivityId(null);
    }
  };

  const getQuestionIcon = (type) => {
    switch (type) {
      case 'ccq': return <HelpCircle size={16} style={{ color: 'var(--color-indigo)' }} />;
      case 'poll': return <BarChart2 size={16} style={{ color: 'var(--color-success)' }} />;
      case 'ordering': return <ListOrdered size={16} style={{ color: 'var(--color-pink)' }} />;
      case 'game': return <Gamepad2 size={16} style={{ color: 'var(--color-warning)' }} />;
      default: return <FileText size={16} />;
    }
  };

  // Get full room code prefixing teacher ID if set
  const getRoomCode = (actId) => {
    if (!actId) return '';
    return teacherPrefix ? `${teacherPrefix}-${actId}` : actId;
  };

  // Get student share link
  const getShareUrl = (actId) => {
    const code = getRoomCode(actId);
    return `${window.location.origin}${window.location.pathname}#/student/${code}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger when course selections happen
  const selectCourse = (course) => {
    setSelectedCourseId(course.id);
    if (course.chapters?.length > 0) {
      const firstChap = course.chapters[0];
      setSelectedChapterId(firstChap.id);
      if (firstChap.activities?.length > 0) {
        setSelectedActivityId(firstChap.activities[0].id);
      } else {
        setSelectedActivityId(null);
      }
    } else {
      setSelectedChapterId(null);
      setSelectedActivityId(null);
    }
  };

  const selectChapter = (chapId) => {
    setSelectedChapterId(chapId);
    const chap = currentCourse.chapters.find(c => c.id === chapId);
    if (chap?.activities?.length > 0) {
      setSelectedActivityId(chap.activities[0].id);
    } else {
      setSelectedActivityId(null);
    }
  };

  return (
    <div className="container animate-slide-up" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Panel */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem 2rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>NickPocket Edu</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Interactive classroom interaction system from Markdown files.
            </p>
          </div>
          
          {/* Teacher Identity Setup (collision prevention) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Teacher ID:</span>
            <input 
              type="text" 
              className="input-field" 
              style={{ width: '150px', padding: '0.5rem 0.75rem', fontSize: '0.85rem', margin: 0 }}
              value={teacherPrefix}
              onChange={(e) => handlePrefixChange(e.target.value)}
              placeholder="e.g. nlh"
              title="Avoid room conflicts with other teachers using the same activity"
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: SELECT COURSE */}
      {!selectedCourseId ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Book size={22} style={{ color: 'var(--color-indigo)' }} /> Available Courses
            </h2>
            
            <div className="grid-2">
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  className="glass-card interactive" 
                  style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative' }}
                  onClick={() => selectCourse(course)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className={`badge ${course.id.startsWith('custom_') ? 'badge-warning' : 'badge-indigo'}`}>
                      {course.id.startsWith('custom_') ? 'Custom' : 'Standard'}
                    </span>
                    {course.id.startsWith('custom_') && (
                      <button 
                        className="btn btn-secondary btn-icon" 
                        style={{ padding: '0.25rem', border: 'none', color: '#f87171' }} 
                        onClick={(e) => deleteCustomCourse(e, course.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.3rem', margin: '1rem 0 0.5rem 0' }}>{course.courseTitle}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Chapters: {course.chapters?.length || 0} • Activities: {
                      course.chapters?.reduce((acc, chap) => acc + (chap.activities?.length || 0), 0) || 0
                    }
                  </p>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', color: 'var(--color-indigo)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Select Course <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drag & Drop Markdown Uploader */}
          <div 
            className="glass-card flex-center"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            style={{
              border: dragActive ? '2px dashed var(--color-indigo)' : '1px dashed var(--border-light)',
              background: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.01)',
              padding: '3rem 2rem',
              borderRadius: '16px',
              textAlign: 'center',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
            onClick={() => document.getElementById('md-file-input').click()}
          >
            <Upload size={48} className="animate-float" style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Drag & Drop Course Markdown File</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '380px' }}>
              Upload any course `.md` file. Make sure it uses `# Course`, `## Chapters`, `### [Activity: ID]` headers.
            </p>
            <input 
              type="file" 
              id="md-file-input" 
              accept=".md,.markdown" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
              Select File from Computer
            </button>
          </div>

        </div>
      ) : (
        /* VIEW 2: COURSE EXPANDED (Chapter Sidebar + Activity details + Static QR Code sharing) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-secondary btn-icon" onClick={() => { setSelectedCourseId(null); setSelectedChapterId(null); setSelectedActivityId(null); }}>
              <ChevronLeft size={20} /> Back
            </button>
            <div>
              <span className="badge badge-indigo">{currentCourse.id.startsWith('custom_') ? 'Custom Markdown' : 'System Course'}</span>
              <h2 style={{ fontSize: '1.5rem', marginTop: '0.2rem' }}>{currentCourse.courseTitle}</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Chapters navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Chapters
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {currentCourse.chapters.map((chapter) => {
                    const isSelected = selectedChapterId === chapter.id;
                    return (
                      <button
                        key={chapter.id}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ 
                          justifyContent: 'space-between', 
                          padding: '0.75rem 1rem', 
                          textAlign: 'left',
                          borderRadius: '10px',
                          border: isSelected ? 'none' : '1px solid var(--border-light)',
                          fontSize: '0.9rem'
                        }}
                        onClick={() => selectChapter(chapter.id)}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                          {chapter.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activities in current Chapter */}
              {currentChapter && (
                <div>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Activities
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {currentChapter.activities?.map((act) => {
                      const isSelected = selectedActivityId === act.id;
                      return (
                        <button
                          key={act.id}
                          className={`btn ${isSelected ? 'btn-success' : 'btn-secondary'}`}
                          style={{
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            textAlign: 'left',
                            borderRadius: '10px',
                            border: isSelected ? 'none' : '1px solid var(--border-light)',
                            fontSize: '0.85rem'
                          }}
                          onClick={() => setSelectedActivityId(act.id)}
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                            {act.title}
                          </span>
                        </button>
                      );
                    })}
                    {(!currentChapter.activities || currentChapter.activities.length === 0) && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '0.5rem' }}>No activities in chapter</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Questions preview + Share Links + Launch panel */}
            {currentActivity ? (
              <div className="glass-card animate-slide-up" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Header row */}
                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-success">Activity Selected</span>
                    <h3 style={{ fontSize: '1.4rem', marginTop: '0.2rem' }}>{currentActivity.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {currentActivity.id}</span>
                  </div>
                  <button 
                    className="btn btn-success animate-pulse-glow" 
                    style={{ padding: '1rem 2rem', fontSize: '1.05rem' }} 
                    onClick={() => onLaunch(getRoomCode(currentActivity.id))}
                  >
                    <Play size={18} fill="white" /> Launch Activity Session
                  </button>
                </div>

                {/* Sharing Block (URL + QR Code) */}
                <div 
                  className="glass-card" 
                  style={{ 
                    padding: '1.25rem', 
                    background: 'rgba(255,255,255,0.01)', 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    alignItems: 'center', 
                    gap: '2rem',
                    border: '1px solid var(--border-glow)'
                  }}
                >
                  {/* QR Code */}
                  <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px', display: 'inline-block' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(getShareUrl(currentActivity.id))}`} 
                      alt="Student Join QR Code"
                      style={{ display: 'block', width: '130px', height: '130px' }}
                    />
                  </div>

                  {/* Share Link Details */}
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      📢 Static Share Link (Embed in slides before class)
                    </h4>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <input 
                        type="text" 
                        readOnly 
                        className="input-field" 
                        style={{ margin: 0, fontSize: '0.85rem', flex: 1 }}
                        value={getShareUrl(currentActivity.id)}
                      />
                      <button 
                        className="btn btn-secondary btn-icon" 
                        onClick={() => copyToClipboard(getShareUrl(currentActivity.id))}
                        title="Copy Link"
                      >
                        {copied ? <Check size={18} style={{ color: 'var(--color-success)' }} /> : <Copy size={18} />}
                      </button>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Room Code: <strong style={{ color: 'var(--color-indigo)' }}>{getRoomCode(currentActivity.id)}</strong>
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      * Any student scanning the QR code or visiting the URL will automatically route to your active room!
                    </span>
                  </div>
                </div>

                {/* Questions Preview */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    Questions ({currentActivity.questions?.length || 0}):
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {currentActivity.questions?.map((q, idx) => (
                      <div 
                        key={q.id || idx} 
                        className="glass-card" 
                        style={{ 
                          background: 'rgba(255,255,255,0.015)', 
                          padding: '1.25rem',
                          borderLeft: `4px solid ${
                            q.type === 'ccq' ? 'var(--color-indigo)' : 
                            q.type === 'poll' ? 'var(--color-success)' : 
                            q.type === 'ordering' ? 'var(--color-pink)' : 'var(--color-warning)'
                          }`
                        }}
                      >
                        <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Question #{idx + 1}</span>
                          <span className="badge" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {getQuestionIcon(q.type)} {q.type.toUpperCase()}
                          </span>
                        </div>
                        
                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', fontWeight: 600 }}>{q.questionText}</h4>

                        {/* Display choices based on type */}
                        {q.type === 'ordering' ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {q.items.map((item, i) => (
                              <span key={i} className="badge" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.04)' }}>
                                <strong>{i + 1}.</strong> {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {q.options.map((opt, i) => {
                              const letters = ['A', 'B', 'C', 'D'];
                              const isCorrect = q.correctAnswer === letters[i];
                              return (
                                <div 
                                  key={i} 
                                  style={{ 
                                    fontSize: '0.85rem', 
                                    padding: '0.4rem 0.6rem', 
                                    borderRadius: '6px', 
                                    background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)',
                                    border: isCorrect ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-light)',
                                    color: isCorrect ? 'var(--color-success)' : 'var(--text-primary)'
                                  }}
                                >
                                  <strong>{letters[i]}.</strong> {opt}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-card flex-center" style={{ padding: '4rem 2rem', flexDirection: 'column' }}>
                <AlertCircle size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Select an activity from the sidebar to preview.</p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Brand footer */}
      <footer className="footer-branding" style={{ marginTop: 'auto', paddingTop: '3rem' }}>
        designed by <span>Nien-Lin Hsueh, Feng Chia University</span>
      </footer>
    </div>
  );
}
