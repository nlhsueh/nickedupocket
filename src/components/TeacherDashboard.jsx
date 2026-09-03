import React, { useState, useEffect } from 'react';
import { 
  Play, Book, FileText, ChevronRight, ChevronLeft, Trash2, 
  Upload, HelpCircle, BarChart2, ListOrdered, Gamepad2, AlertCircle, Copy, Check, QrCode, Users, Cloud, MessageSquare
} from 'lucide-react';
import { parseMarkdownCourse } from '../utils/mdParser';
import { formatChapterTitle, getActivityShortTitle } from '../utils/formatters';
import { QRCodeCanvas } from 'qrcode.react';
import FormattedMarkdown from '../utils/formatMarkdown';
import { useThemeLang, ThemeLangControls } from '../context/ThemeLangContext';

export default function TeacherDashboard({ 
  courses, customCourses, setCustomCourses, onLaunch,
  selectedCourseId, setSelectedCourseId,
  selectedChapterId, setSelectedChapterId,
  selectedActivityId, setSelectedActivityId
}) {
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const { t, lang } = useThemeLang();
  const [copiedId, setCopiedId] = useState(null);
  const [qrCopiedId, setQrCopiedId] = useState(null);
  
  // Track recently accessed courses
  const [recentCourseIds, setRecentCourseIds] = useState(() => {
    const saved = localStorage.getItem('nickpocket_recent_courses');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Teacher ID Prefix to prevent broker topic collisions
  const [teacherPrefix, setTeacherPrefix] = useState(() => {
    return localStorage.getItem('nickpocket_teacher_prefix') || '';
  });

  const handlePrefixChange = (val) => {
    const clean = val.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 15);
    setTeacherPrefix(clean);
    localStorage.setItem('nickpocket_teacher_prefix', clean);
  };

  // Sort courses by recently accessed
  const sortedCourses = [...courses].sort((a, b) => {
    const idxA = recentCourseIds.indexOf(a.id);
    const idxB = recentCourseIds.indexOf(b.id);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

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
      case 'wordcloud': return <Cloud size={16} style={{ color: 'var(--color-indigo)' }} />;
      case 'pair': return <Users size={16} style={{ color: '#06b6d4' }} />;
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

  const copyQrCodeToClipboard = () => {
    const canvas = document.getElementById('dashboard-qr-canvas');
    if (!canvas) return;
    
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        setQrCopied(true);
        setTimeout(() => setQrCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy QR Code image:", err);
      }
    });
  };

  const copyActivityQrToClipboard = (actId) => {
    const canvas = document.getElementById(`canvas_qr_${actId}`);
    if (!canvas) return;
    
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        setQrCopiedId(actId);
        setTimeout(() => setQrCopiedId(null), 2000);
      } catch (err) {
        console.error("Failed to copy QR Code image:", err);
      }
    });
  };

  const copyActivityLinkToClipboard = (actId) => {
    const url = getShareUrl(actId);
    navigator.clipboard.writeText(url);
    setCopiedId(actId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Trigger when course selections happen
  const selectCourse = (course) => {
    setSelectedCourseId(course.id);
    
    // Update recently accessed list
    const nextRecents = [course.id, ...recentCourseIds.filter(id => id !== course.id)];
    setRecentCourseIds(nextRecents);
    localStorage.setItem('nickpocket_recent_courses', JSON.stringify(nextRecents));

    if (course.chapters?.length > 0) {
      const firstChap = course.chapters[0];
      setSelectedChapterId(firstChap.id);
      setSelectedActivityId(null); // Show chapter overview by default
    } else {
      setSelectedChapterId(null);
      setSelectedActivityId(null);
    }
  };

  const selectChapter = (chapId) => {
    setSelectedChapterId(chapId);
    setSelectedActivityId(null); // Show chapter overview by default
  };

  return (
    <div className="container animate-slide-up" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Panel */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem 2rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{t('appName')}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {t('appSubtitle')}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <ThemeLangControls />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Teacher ID:</span>
              <input 
                type="text" 
                className="input-field" 
                style={{ width: '130px', padding: '0.45rem 0.65rem', fontSize: '0.85rem', margin: 0 }}
                value={teacherPrefix}
                onChange={(e) => handlePrefixChange(e.target.value)}
                placeholder="e.g. nlh"
                title="Avoid room conflicts with other teachers using the same activity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: SELECT COURSE */}
      {!selectedCourseId ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Book size={22} style={{ color: 'var(--color-indigo)' }} /> {lang === 'zh' ? '可用課程清單' : 'Available Courses'}
            </h2>
            
            <div className="grid-2">
              {sortedCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="glass-card interactive" 
                  style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative' }}
                  onClick={() => selectCourse(course)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className={`badge ${course.id.startsWith('custom_') ? 'badge-warning' : 'badge-indigo'}`}>
                      {course.id.startsWith('custom_') ? (lang === 'zh' ? '自訂課程' : 'Custom') : (lang === 'zh' ? '系統內建' : 'Standard')}
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
                    {lang === 'zh' 
                      ? `章節數：${course.chapters?.length || 0} • 互動活動：${course.chapters?.reduce((acc, chap) => acc + (chap.activities?.length || 0), 0) || 0} 個`
                      : `Chapters: ${course.chapters?.length || 0} • Activities: ${course.chapters?.reduce((acc, chap) => acc + (chap.activities?.length || 0), 0) || 0}`}
                  </p>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', color: 'var(--color-indigo)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {lang === 'zh' ? '進入課程章節' : 'Select Course'} <ChevronRight size={16} />
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
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              {lang === 'zh' ? '拖放 Markdown 課程檔案至此' : 'Drag & Drop Course Markdown File'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '380px' }}>
              {lang === 'zh' 
                ? '上傳任何自訂課程 .md 檔案，支援 # 課程名稱、## 章節、### [Activity: ID] 題型標籤。' 
                : 'Upload any course .md file. Make sure it uses # Course, ## Chapters, ### [Activity: ID] headers.'}
            </p>
            <input 
              type="file" 
              id="md-file-input" 
              accept=".md,.markdown" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
              {lang === 'zh' ? '從電腦選取檔案上傳' : 'Select File from Computer'}
            </button>
          </div>

        </div>
      ) : (
        /* VIEW 2: COURSE EXPANDED (Chapter Sidebar + Activity details + Static QR Code sharing) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
          
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn btn-secondary btn-icon" onClick={() => { setSelectedCourseId(null); setSelectedChapterId(null); setSelectedActivityId(null); }}>
                <ChevronLeft size={20} /> {t('back')}
              </button>
              <div>
                <span className="badge badge-indigo">{currentCourse.id.startsWith('custom_') ? 'Custom Markdown' : 'System Course'}</span>
                <h2 style={{ fontSize: '1.5rem', marginTop: '0.2rem' }}>{currentCourse.courseTitle}</h2>
              </div>
            </div>
            <ThemeLangControls />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Chapters navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  {lang === 'zh' ? '章節清單' : 'Chapters'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {currentCourse.chapters.map((chapter) => {
                    const isSelected = selectedChapterId === chapter.id;
                    const displayTitle = formatChapterTitle(chapter.title);
                    return (
                      <button
                        key={chapter.id}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ 
                          justifyContent: 'flex-start', 
                          padding: '0.75rem 1rem', 
                          textAlign: 'left',
                          borderRadius: '10px',
                          border: isSelected ? 'none' : '1px solid var(--border-light)',
                          fontSize: '0.9rem',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                        onClick={() => selectChapter(chapter.id)}
                        title={displayTitle}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                          {displayTitle}
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
                    {lang === 'zh' ? '章節活動' : 'Activities'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <button
                      className={`btn ${selectedActivityId === null ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        justifyContent: 'flex-start',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        borderRadius: '10px',
                        border: selectedActivityId === null ? 'none' : '1px solid var(--border-light)',
                        fontSize: '0.85rem',
                        width: '100%',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onClick={() => setSelectedActivityId(null)}
                    >
                      <span>{lang === 'zh' ? '📂 章節總覽 (全部活動)' : '📂 Chapter Overview (All)'}</span>
                    </button>

                    {currentChapter.activities?.map((act) => {
                      const isSelected = selectedActivityId === act.id;
                      const shortTitle = getActivityShortTitle(act, currentChapter);
                      return (
                        <button
                          key={act.id}
                          className={`btn ${isSelected ? 'btn-success' : 'btn-secondary'}`}
                          style={{
                            justifyContent: 'flex-start',
                            gap: '0.5rem',
                            padding: '0.75rem 1rem',
                            textAlign: 'left',
                            borderRadius: '10px',
                            border: isSelected ? 'none' : '1px solid var(--border-light)',
                            fontSize: '0.85rem',
                            width: '100%',
                            boxSizing: 'border-box',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onClick={() => setSelectedActivityId(act.id)}
                          title={shortTitle}
                        >
                          {getQuestionIcon(act.questions?.[0]?.type)}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
                            {shortTitle}
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
                    <span className="badge badge-success">{lang === 'zh' ? '已選取活動' : 'Activity Selected'}</span>
                    <h3 style={{ fontSize: '1.4rem', marginTop: '0.2rem' }}>{getActivityShortTitle(currentActivity, currentChapter)}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {currentActivity.id}</span>
                  </div>
                  <button 
                    className="btn btn-success animate-pulse-glow" 
                    style={{ padding: '1rem 2rem', fontSize: '1.05rem' }} 
                    onClick={() => onLaunch(getRoomCode(currentActivity.id))}
                  >
                    <Play size={18} fill="white" /> {lang === 'zh' ? '啟動課堂互動房間 (Launch)' : 'Launch Activity Session'}
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
                  <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <QRCodeCanvas 
                      id="dashboard-qr-canvas"
                      value={getShareUrl(currentActivity.id)}
                      size={130}
                      bgColor="#ffffff"
                      fgColor="#080B11"
                      level="H"
                      includeMargin={false}
                    />
                    <button 
                      className="btn btn-secondary" 
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        fontSize: '0.75rem', 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.25rem',
                        color: 'var(--color-indigo)',
                        borderColor: 'rgba(99, 102, 241, 0.3)'
                      }}
                      onClick={copyQrCodeToClipboard}
                      type="button"
                    >
                      {qrCopied ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <QrCode size={12} />}
                      {qrCopied ? (lang === 'zh' ? '已複製！' : 'Copied QR!') : (lang === 'zh' ? '複製 QR 碼' : 'Copy QR')}
                    </button>
                  </div>

                  {/* Share Link Details */}
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      📢 {lang === 'zh' ? '課堂投影片嵌入邀請連結 (上課前直接使用)' : 'Static Share Link (Embed in slides before class)'}
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
                        title={lang === 'zh' ? '複製連結' : 'Copy Link'}
                      >
                        {copied ? <Check size={18} style={{ color: 'var(--color-success)' }} /> : <Copy size={18} />}
                      </button>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {lang === 'zh' ? '房間代碼：' : 'Room Code: '}<strong style={{ color: 'var(--color-indigo)' }}>{getRoomCode(currentActivity.id)}</strong>
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {lang === 'zh' 
                        ? '* 學生掃描 QR Code 或造訪上述網址，系統會自動導引至您啟動的對應房間！' 
                        : '* Any student scanning the QR code or visiting the URL will automatically route to your active room!'}
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
                        
                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                          <FormattedMarkdown text={q.questionText} />
                        </h4>

                        {/* Display choices based on type */}
                        {q.type === 'ordering' ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {q.items.map((item, i) => (
                              <span key={i} className="badge" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.04)' }}>
                                <strong>{i + 1}.</strong> <FormattedMarkdown text={item} />
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {q.options.map((opt, i) => {
                              const letter = String.fromCharCode(65 + i);
                              const isCorrect = q.correctAnswer === letter;
                              const cleanOpt = String(opt).replace(/^(\(?[A-Za-z]\)?[.:、\)\-\s]+|Option\s+[A-Za-z][:.\-\s]*)/i, '').trim() || opt;
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
                                  <strong>{letter}.</strong> {cleanOpt}
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
            ) : currentChapter ? (
              <div className="glass-card animate-slide-up" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Header row */}
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                  <span className="badge badge-indigo">{lang === 'zh' ? '章節總覽' : 'Chapter Overview'}</span>
                  <h3 style={{ fontSize: '1.55rem', marginTop: '0.25rem', marginBottom: '0.25rem' }}>{formatChapterTitle(currentChapter.title)}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {lang === 'zh' ? `活動總數：${currentChapter.activities?.length || 0} 個` : `Total activities: ${currentChapter.activities?.length || 0}`}
                  </p>
                </div>

                {/* Filter bar */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                    {lang === 'zh' ? '依題型篩選活動：' : 'Filter Activities by Type:'}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['all', 'ccq', 'poll', 'ordering', 'game', 'wordcloud', 'pair', 'short'].map((type) => {
                      const isActive = activityTypeFilter === type;
                      return (
                        <button
                          key={type}
                          className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          onClick={() => setActivityTypeFilter(type)}
                        >
                          {type === 'all' ? (lang === 'zh' ? '📁 全部' : '📁 All') : 
                           type === 'ccq' ? '❓ CCQ' : 
                           type === 'poll' ? (lang === 'zh' ? '📊 投票/問卷' : '📊 Poll/Survey') : 
                           type === 'ordering' ? (lang === 'zh' ? '🔢 排序題' : '🔢 Ordering') : 
                           type === 'game' ? (lang === 'zh' ? '🎮 搶答題' : '🎮 Game') :
                           type === 'wordcloud' ? (lang === 'zh' ? '☁️ 文字雲' : '☁️ WordCloud') :
                           type === 'pair' ? (lang === 'zh' ? '👥 雙人討論' : '👥 Pair Discussion') : (lang === 'zh' ? '📝 簡答題' : '📝 Short Answer')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Activities List */}
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {(() => {
                      const getActivityType = (act) => {
                        if (!act.questions || act.questions.length === 0) return 'unknown';
                        return act.questions[0].type;
                      };

                      const filteredActs = (currentChapter.activities || []).filter((act) => {
                        if (activityTypeFilter === 'all') return true;
                        return getActivityType(act) === activityTypeFilter;
                      });

                      if (filteredActs.length === 0) {
                        return (
                          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            No activities match this filter in this chapter.
                          </div>
                        );
                      }

                      return filteredActs.map((act) => {
                        const actType = getActivityType(act);
                        const isLinkCopied = copiedId === act.id;
                        const isQrCopied = qrCopiedId === act.id;
                        const roomCodeForAct = getRoomCode(act.id);
                        const shareUrlForAct = getShareUrl(act.id);
                        const cardTitle = getActivityShortTitle(act, currentChapter);

                        return (
                          <div 
                            key={act.id} 
                            className="glass-card" 
                            style={{ 
                              background: 'rgba(255,255,255,0.015)', 
                              padding: '1.5rem',
                              borderLeft: `4px solid ${
                                actType === 'ccq' ? 'var(--color-indigo)' : 
                                actType === 'poll' ? 'var(--color-success)' : 
                                actType === 'ordering' ? 'var(--color-pink)' : 
                                actType === 'game' ? 'var(--color-warning)' : 
                                actType === 'pair' ? '#06b6d4' : 'var(--color-violet)'
                              }`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem'
                            }}
                          >
                            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div>
                                <span className="badge" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                  {actType}
                                </span>
                                <h4 style={{ fontSize: '1.15rem', fontWeight: 600, marginTop: '0.2rem' }}>{cardTitle}</h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room: {roomCodeForAct}</span>
                              </div>

                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                  className="btn btn-secondary"
                                  style={{ padding: '0.5rem 0.75rem', gap: '0.25rem', fontSize: '0.75rem', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  onClick={() => copyActivityLinkToClipboard(act.id)}
                                  title={lang === 'zh' ? '複製學生邀請連結' : 'Copy Student Link'}
                                >
                                  {isLinkCopied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                                  {isLinkCopied ? (lang === 'zh' ? '已複製！' : 'Copied!') : (lang === 'zh' ? '複製連結' : 'Copy Link')}
                                </button>

                                <button 
                                  className="btn btn-secondary"
                                  style={{ padding: '0.5rem 0.75rem', gap: '0.25rem', fontSize: '0.75rem', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-indigo)', borderColor: 'rgba(99, 102, 241, 0.3)' }}
                                  onClick={() => copyActivityQrToClipboard(act.id)}
                                  title={lang === 'zh' ? '複製 QR Code 圖片' : 'Copy QR Code Image'}
                                >
                                  {isQrCopied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <QrCode size={14} />}
                                  {isQrCopied ? (lang === 'zh' ? '已複製！' : 'Copied!') : (lang === 'zh' ? '複製 QR' : 'Copy QR')}
                                </button>

                                <button 
                                  className="btn btn-success" 
                                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }} 
                                  onClick={() => onLaunch(roomCodeForAct)}
                                >
                                  <Play size={12} fill="white" /> {lang === 'zh' ? '啟動' : 'Launch'}
                                </button>
                              </div>
                            </div>

                            {/* Question Details Preview */}
                            {act.questions && act.questions.length > 0 && (
                              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, margin: '0 0 0.5rem 0' }}>
                                  Question: <FormattedMarkdown text={act.questions[0].questionText} />
                                </p>
                                {actType !== 'ordering' && actType !== 'short' && actType !== 'pair' && act.questions[0].options && (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {act.questions[0].options.map((opt, oIdx) => {
                                      const letter = String.fromCharCode(65 + oIdx);
                                      const cleanOpt = String(opt).replace(/^(\(?[A-Za-z]\)?[.:、\)\-\s]+|Option\s+[A-Za-z][:.\-\s]*)/i, '').trim() || opt;
                                      return (
                                        <span key={oIdx} className="badge" style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)' }}>
                                          {letter}. <FormattedMarkdown text={cleanOpt} />
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                                {actType === 'ordering' && act.questions[0].items && (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {act.questions[0].items.map((item, oIdx) => (
                                      <span key={oIdx} className="badge" style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)' }}>
                                        {oIdx + 1}. <FormattedMarkdown text={item} />
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {actType === 'pair' && act.questions[0].description && (
                                  <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderLeft: '2px solid rgba(6, 182, 212, 0.4)', paddingLeft: '0.5rem' }}>
                                    <FormattedMarkdown text={act.questions[0].description} />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Hidden QR Code Canvas container for image copying */}
                            <div style={{ display: 'none' }}>
                              <QRCodeCanvas 
                                id={`canvas_qr_${act.id}`}
                                value={shareUrlForAct}
                                size={120}
                                bgColor="#ffffff"
                                fgColor="#080B11"
                                level="H"
                                includeMargin={false}
                              />
                            </div>

                          </div>
                        );
                      });
                    })()}
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
