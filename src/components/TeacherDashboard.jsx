import React, { useState } from 'react';
import { 
  Play, Book, FileText, ChevronRight, ChevronLeft, Trash2, 
  Upload, HelpCircle, BarChart2, ListOrdered, Gamepad2, AlertCircle, RefreshCw
} from 'lucide-react';
import { parseMarkdownCourse } from '../utils/mdParser';

export default function TeacherDashboard({ courses, customCourses, setCustomCourses, onLaunch }) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Find currently selected course & chapter
  const currentCourse = courses.find(c => c.id === selectedCourseId);
  const currentChapter = currentCourse?.chapters?.find(ch => ch.id === selectedChapterId);

  // Markdown uploader handlers
  const handleMarkdownUpload = (file) => {
    if (!file) return;
    
    // Check extension
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
        setSelectedChapterId(parsedCourse.chapters[0].id);
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

  // Remove custom course
  const deleteCustomCourse = (e, id) => {
    e.stopPropagation(); // Avoid triggering card selection
    if (window.confirm('Are you sure you want to delete this custom course?')) {
      const nextCustom = customCourses.filter(c => c.id !== id);
      setCustomCourses(nextCustom);
      localStorage.setItem('nickpocket_custom_courses', JSON.stringify(nextCustom));
      if (selectedCourseId === id) {
        setSelectedCourseId(null);
        setSelectedChapterId(null);
      }
    }
  };

  const clearAllCustom = () => {
    if (window.confirm('Delete all custom uploaded courses?')) {
      setCustomCourses([]);
      localStorage.removeItem('nickpocket_custom_courses');
      setSelectedCourseId(null);
      setSelectedChapterId(null);
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

  return (
    <div className="container animate-slide-up" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Panel */}
      <div className="flex-between glass-card" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>NickPocket Edu</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Interactive classroom interaction system from Markdown files.
          </p>
        </div>
        {customCourses.length > 0 && !selectedCourseId && (
          <button className="btn btn-danger" onClick={clearAllCustom}>
            <Trash2 size={16} /> Clear Custom
          </button>
        )}
      </div>

      {/* VIEW 1: SELECT COURSE (Main Menu) */}
      {!selectedCourseId ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Courses grid */}
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
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    if (course.chapters?.length > 0) {
                      setSelectedChapterId(course.chapters[0].id);
                    }
                  }}
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
                        title="Delete Course"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.3rem', margin: '1rem 0 0.5rem 0' }}>{course.courseTitle}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Chapters: {course.chapters?.length || 0} • Questions: {
                      course.chapters?.reduce((acc, chap) => acc + (chap.questions?.length || 0), 0) || 0
                    }
                  </p>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', color: 'var(--color-indigo)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Select Chapters <ChevronRight size={16} />
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
              Upload any course `.md` file. The file must be structured with `# Course` and `## Chapters` to build chapter sessions instantly!
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
        /* VIEW 2: COURSE EXPANDED (Chapter list & Question details) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
          
          {/* Back button and course title summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-secondary btn-icon" onClick={() => { setSelectedCourseId(null); setSelectedChapterId(null); }}>
              <ChevronLeft size={20} /> Back
            </button>
            <div>
              <span className="badge badge-indigo">{currentCourse.id.startsWith('custom_') ? 'Custom Markdown' : 'System Course'}</span>
              <h2 style={{ fontSize: '1.5rem', marginTop: '0.2rem' }}>{currentCourse.courseTitle}</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left sidebar: Chapters selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Course Chapters
              </h4>
              {currentCourse.chapters.map((chapter) => {
                const isSelected = selectedChapterId === chapter.id;
                return (
                  <button
                    key={chapter.id}
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ 
                      justifyContent: 'space-between', 
                      padding: '1rem', 
                      textAlign: 'left',
                      borderRadius: '12px',
                      border: isSelected ? 'none' : '1px solid var(--border-light)'
                    }}
                    onClick={() => setSelectedChapterId(chapter.id)}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>
                      {chapter.title}
                    </span>
                    <span className="badge" style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.08)' }}>
                      {chapter.questions?.length || 0} Qs
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right content pane: Questions preview & Launch button */}
            {currentChapter ? (
              <div className="glass-card animate-slide-up" style={{ padding: '2rem' }}>
                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span className="badge badge-success">Chapter selected</span>
                    <h3 style={{ fontSize: '1.4rem', marginTop: '0.2rem' }}>{currentChapter.title}</h3>
                  </div>
                  <button className="btn btn-success" style={{ padding: '1rem 2rem' }} onClick={() => onLaunch(currentCourse.id, currentChapter.id)}>
                    <Play size={18} fill="white" /> Launch Chapter Session
                  </button>
                </div>

                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Questions Sequence ({currentChapter.questions?.length || 0}):
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentChapter.questions?.map((q, idx) => (
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
                      
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 600 }}>{q.questionText}</h4>

                      {/* Display options / configurations based on type */}
                      {q.type === 'ordering' ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {q.items.map((item, i) => (
                            <span key={i} className="badge" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.04)' }}>
                              <strong>{i + 1}.</strong> {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
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
            ) : (
              <div className="glass-card flex-center" style={{ padding: '4rem 2rem', flexDirection: 'column' }}>
                <AlertCircle size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Select a chapter from the sidebar to preview questions.</p>
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
