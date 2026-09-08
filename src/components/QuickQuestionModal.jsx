import React, { useState } from 'react';
import { 
  X, Zap, CheckCircle2, ListFilter, MessageSquareText, 
  Play, Plus, Trash2, Clock, Sparkles, AlertCircle
} from 'lucide-react';
import { useThemeLang } from '../context/ThemeLangContext';

export default function QuickQuestionModal({ isOpen, onClose, onLaunchInstant, teacherPrefix }) {
  const { lang } = useThemeLang();

  // 1. Question Type: 'tf' (是非) | 'mc' (選擇) | 'short' (簡答)
  const [questionType, setQuestionType] = useState('tf');

  // 2. Question Prompt
  const [questionText, setQuestionText] = useState('');

  // 3. True / False settings
  const [tfCorrect, setTfCorrect] = useState('A'); // 'A' (True), 'B' (False), '' (Survey / No correct)
  const [tfLabelStyle, setTfLabelStyle] = useState('tf'); // 'tf' (正確/錯誤) | 'yn' (是/否)

  // 4. Multiple Choice settings
  const [mcOptions, setMcOptions] = useState(['選項 A', '選項 B', '選項 C', '選項 D']);
  const [mcCorrect, setMcCorrect] = useState('A'); // 'A', 'B', 'C', 'D', '' (No correct)

  // 5. Time Limit
  const [timeLimit, setTimeLimit] = useState(60); // 0 (unlimited), 30, 60, 90, 120

  if (!isOpen) return null;

  // Oral prompt quick preset
  const handleSetOralPrompt = () => {
    setQuestionText(lang === 'zh' ? '（請聽老師課堂口頭題目作答）' : '(Please answer based on oral question)');
  };

  const handleAddMcOption = () => {
    if (mcOptions.length >= 6) return;
    const nextLetter = String.fromCharCode(65 + mcOptions.length);
    setMcOptions(prev => [...prev, `選項 ${nextLetter}`]);
  };

  const handleRemoveMcOption = (idx) => {
    if (mcOptions.length <= 2) return;
    const nextOpts = mcOptions.filter((_, i) => i !== idx);
    setMcOptions(nextOpts);
    // Adjust correct answer if out of bounds
    if (mcCorrect) {
      const correctIdx = mcCorrect.charCodeAt(0) - 65;
      if (correctIdx >= nextOpts.length) {
        setMcCorrect(String.fromCharCode(65 + nextOpts.length - 1));
      }
    }
  };

  const handleMcOptionChange = (idx, text) => {
    setMcOptions(prev => {
      const next = [...prev];
      next[idx] = text;
      return next;
    });
  };

  const handleLaunch = (e) => {
    e.preventDefault();

    // 1. Prepare options & correct answer based on type
    let finalOptions = [];
    let finalCorrect = '';
    let finalType = 'ccq';

    if (questionType === 'tf') {
      finalOptions = tfLabelStyle === 'tf' 
        ? [lang === 'zh' ? '正確 (True)' : 'True', lang === 'zh' ? '錯誤 (False)' : 'False']
        : [lang === 'zh' ? '是 (Yes)' : 'Yes', lang === 'zh' ? '否 (No)' : 'No'];
      finalCorrect = tfCorrect;
      finalType = tfCorrect ? 'ccq' : 'poll';
    } else if (questionType === 'mc') {
      finalOptions = mcOptions.map(opt => opt.trim()).filter(Boolean);
      if (finalOptions.length === 0) {
        finalOptions = ['選項 A', '選項 B', '選項 C', '選項 D'];
      }
      finalCorrect = mcCorrect;
      finalType = mcCorrect ? 'ccq' : 'poll';
    } else if (questionType === 'short') {
      finalOptions = [];
      finalCorrect = '';
      finalType = 'short';
    }

    // 2. Generate short roomCode
    const randCode = Math.floor(100 + Math.random() * 900); // 3-digit number e.g. 382
    const cleanPrefix = (teacherPrefix || '').trim();
    const actId = `quick-${randCode}`;
    const roomCode = cleanPrefix ? `${cleanPrefix}-${actId}` : actId;

    const defaultTitle = questionType === 'tf' 
      ? (lang === 'zh' ? '即時是非題' : 'Quick True/False')
      : questionType === 'mc'
        ? (lang === 'zh' ? '即時選擇題' : 'Quick Multiple Choice')
        : (lang === 'zh' ? '即時簡答題' : 'Quick Short Answer');

    const activityData = {
      id: actId,
      title: questionText.trim() || defaultTitle,
      questions: [
        {
          id: `q_${Date.now()}_0`,
          type: finalType,
          questionText: questionText.trim() || defaultTitle,
          options: finalOptions,
          correctAnswer: finalCorrect,
          items: [],
          timeLimit: timeLimit,
          description: ''
        }
      ],
      isInstant: true
    };

    onLaunchInstant({ roomCode, activityData });
  };

  return (
    <div 
      className="animate-fade-in"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-card animate-pop"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1.5px solid rgba(99, 102, 241, 0.45)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(99, 102, 241, 0.15)',
          borderRadius: '24px',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' }}>
              <Zap size={20} fill="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
                {lang === 'zh' ? '課堂即時出題' : 'Quick Question'}
              </h2>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {lang === 'zh' ? '設定題型後立即發布，學生掃碼即刻作答，無需存檔' : 'Set question, launch instantly for student voting/answering'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-icon"
            style={{ padding: '0.35rem', height: '32px', width: '32px' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleLaunch} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* STEP 1: Select Type (3 Choices only) */}
          <div>
            <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>1. 選擇題型</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>（僅提供三種最常用互動題型）</span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              {/* True / False */}
              <button
                type="button"
                className="glass-card animate-pop"
                style={{
                  padding: '0.85rem 0.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderRadius: '12px',
                  background: questionType === 'tf' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)',
                  border: questionType === 'tf' ? '2px solid var(--color-indigo)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  color: questionType === 'tf' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setQuestionType('tf')}
              >
                <CheckCircle2 size={22} style={{ color: questionType === 'tf' ? '#818cf8' : 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{lang === 'zh' ? '是非題' : 'True/False'}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>正誤 / 是否</span>
              </button>

              {/* Multiple Choice */}
              <button
                type="button"
                className="glass-card animate-pop"
                style={{
                  padding: '0.85rem 0.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderRadius: '12px',
                  background: questionType === 'mc' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)',
                  border: questionType === 'mc' ? '2px solid var(--color-indigo)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  color: questionType === 'mc' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setQuestionType('mc')}
              >
                <ListFilter size={22} style={{ color: questionType === 'mc' ? '#818cf8' : 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{lang === 'zh' ? '選擇題' : 'Multiple Choice'}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>單選 A~D</span>
              </button>

              {/* Short Answer */}
              <button
                type="button"
                className="glass-card animate-pop"
                style={{
                  padding: '0.85rem 0.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderRadius: '12px',
                  background: questionType === 'short' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)',
                  border: questionType === 'short' ? '2px solid var(--color-indigo)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  color: questionType === 'short' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setQuestionType('short')}
              >
                <MessageSquareText size={22} style={{ color: questionType === 'short' ? '#818cf8' : 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{lang === 'zh' ? '簡答題' : 'Short QA'}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>文字輸入想法</span>
              </button>
            </div>
          </div>

          {/* STEP 2: Question Prompt Input */}
          <div>
            <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>
                2. 題目內容 (選填)
              </label>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', height: '24px', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-indigo)' }}
                onClick={handleSetOralPrompt}
              >
                <Sparkles size={11} /> {lang === 'zh' ? '口頭提問樣板' : 'Oral Question'}
              </button>
            </div>

            <textarea
              className="input-field"
              style={{
                width: '100%',
                minHeight: '70px',
                fontSize: '0.92rem',
                padding: '0.75rem',
                borderRadius: '10px',
                resize: 'vertical',
                lineHeight: '1.4',
                margin: 0
              }}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={
                questionType === 'tf' 
                  ? '例如：軟體測試的目的在於證明程式完全沒有錯誤？' 
                  : questionType === 'mc'
                    ? '例如：下列哪一項不是敏捷開發的核心原則？'
                    : '例如：請用一句話簡述你今天最有收穫的一個觀念。'
              }
            />
          </div>

          {/* STEP 3: Specific Configuration based on Type */}

          {/* Type A: True / False Settings */}
          {questionType === 'tf' && (
            <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>選項樣式：</span>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem', borderRadius: '6px', background: tfLabelStyle === 'tf' ? 'var(--color-indigo)' : 'transparent', color: tfLabelStyle === 'tf' ? '#fff' : 'var(--text-secondary)' }}
                    onClick={() => setTfLabelStyle('tf')}
                  >
                    正確 / 錯誤
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem', borderRadius: '6px', background: tfLabelStyle === 'yn' ? 'var(--color-indigo)' : 'transparent', color: tfLabelStyle === 'yn' ? '#fff' : 'var(--text-secondary)' }}
                    onClick={() => setTfLabelStyle('yn')}
                  >
                    是 / 否
                  </button>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.45rem' }}>
                  標準答案 (選填)：
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                  <button
                    type="button"
                    className={`btn ${tfCorrect === 'A' ? 'btn-success' : 'btn-secondary'}`}
                    style={{ padding: '0.5rem', fontSize: '0.82rem' }}
                    onClick={() => setTfCorrect('A')}
                  >
                    {tfLabelStyle === 'tf' ? 'A. 正確 ✅' : 'A. 是 (Yes) ✅'}
                  </button>
                  <button
                    type="button"
                    className={`btn ${tfCorrect === 'B' ? 'btn-success' : 'btn-secondary'}`}
                    style={{ padding: '0.5rem', fontSize: '0.82rem' }}
                    onClick={() => setTfCorrect('B')}
                  >
                    {tfLabelStyle === 'tf' ? 'B. 錯誤 ❌' : 'B. 否 (No) ❌'}
                  </button>
                  <button
                    type="button"
                    className={`btn ${tfCorrect === '' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.5rem', fontSize: '0.82rem' }}
                    onClick={() => setTfCorrect('')}
                  >
                    無標準答案 (調查)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Type B: Multiple Choice Settings */}
          {questionType === 'mc' && (
            <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>選項列表與標準答案：</span>
                {mcOptions.length < 6 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', height: '24px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    onClick={handleAddMcOption}
                  >
                    <Plus size={12} /> 新增選項
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.75rem' }}>
                {mcOptions.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isCorrect = mcCorrect === letter;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {/* Set as correct answer button */}
                      <button
                        type="button"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: isCorrect ? '2px solid #10b981' : '1px solid var(--border-light)',
                          background: isCorrect ? '#10b981' : 'rgba(255,255,255,0.06)',
                          color: isCorrect ? '#fff' : 'var(--text-secondary)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                        onClick={() => setMcCorrect(isCorrect ? '' : letter)}
                        title={isCorrect ? '已設為標準答案 (點擊取消)' : `點擊設為正確答案 (${letter})`}
                      >
                        {letter}
                      </button>

                      <input
                        type="text"
                        className="input-field"
                        style={{ margin: 0, padding: '0.4rem 0.65rem', fontSize: '0.88rem', flex: 1 }}
                        value={opt}
                        onChange={(e) => handleMcOptionChange(idx, e.target.value)}
                        placeholder={`選項 ${letter}`}
                      />

                      {mcOptions.length > 2 && (
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ color: 'var(--text-muted)', padding: '0.35rem', cursor: 'pointer', background: 'transparent', border: 'none' }}
                          onClick={() => handleRemoveMcOption(idx)}
                          title="刪除此選項"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>* 點選左側英文字母按鈕，可直接設定該選項為正確答案。</span>
                {mcCorrect && (
                  <span style={{ color: '#10b981', fontWeight: 600 }}>正確答案：{mcCorrect}</span>
                )}
              </div>
            </div>
          )}

          {/* Type C: Short QA Info */}
          {questionType === 'short' && (
            <div className="glass-card" style={{ padding: '0.85rem 1rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sparkles size={20} style={{ color: 'var(--color-indigo)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                學生端將提供開放式文字輸入框。學生提交後，老師投影幕將以卡片瀑布流即時展示所有人的作答內容。
              </span>
            </div>
          )}

          {/* STEP 4: Duration Selector */}
          <div>
            <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} style={{ color: 'var(--color-indigo)' }} />
              <span>3. 建議作答時間</span>
            </label>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { val: 0, label: '無限制 (手動)' },
                { val: 30, label: '30 秒' },
                { val: 60, label: '60 秒' },
                { val: 90, label: '90 秒' },
                { val: 120, label: '2 分鐘' }
              ].map(d => (
                <button
                  key={d.val}
                  type="button"
                  className="btn btn-secondary"
                  style={{
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.78rem',
                    borderRadius: '8px',
                    background: timeLimit === d.val ? 'var(--color-indigo)' : 'rgba(255,255,255,0.03)',
                    color: timeLimit === d.val ? '#fff' : 'var(--text-secondary)',
                    borderColor: timeLimit === d.val ? 'var(--color-indigo)' : 'var(--border-light)'
                  }}
                  onClick={() => setTimeLimit(d.val)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.85rem' }}
              onClick={onClose}
            >
              {lang === 'zh' ? '取消' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="btn btn-primary animate-pulse-glow"
              style={{
                flex: 2,
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Play size={18} fill="white" />
              {lang === 'zh' ? '🚀 馬上發佈，讓學生掃碼' : '🚀 Launch Now for Students'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
