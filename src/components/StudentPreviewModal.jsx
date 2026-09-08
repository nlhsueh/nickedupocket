import React, { useState } from 'react';
import { 
  X, ExternalLink, RefreshCw, Smartphone, Tablet, CheckCircle, 
  ChevronLeft, ChevronRight, CornerDownRight, 
  Users, MessageSquare, Cloud, ChevronUp, ChevronDown
} from 'lucide-react';
import FormattedMarkdown from '../utils/formatMarkdown';
import { useThemeLang } from '../context/ThemeLangContext';

export default function StudentPreviewModal({ activity, roomCode, onClose, shareUrl }) {
  const { lang } = useThemeLang();
  const questions = activity?.questions || [];
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [deviceWidth, setDeviceWidth] = useState('mobile'); // 'mobile' (400px) | 'tablet' (560px)

  // Question interaction states for preview testing
  const [answersMap, setAnswersMap] = useState({});
  const [submittedMap, setSubmittedMap] = useState({});
  const [orderingMap, setOrderingMap] = useState({});
  const [textMap, setTextMap] = useState({});
  const [partnerMap, setPartnerMap] = useState({});

  const currentQ = questions[currentQIndex] || null;
  const qType = currentQ?.type || 'ccq';

  const selectedAnswer = answersMap[currentQIndex] || null;
  const hasSubmitted = Boolean(submittedMap[currentQIndex]);

  // Current ordering list
  const currentOrdering = orderingMap[currentQIndex] || (currentQ?.items ? [...currentQ.items] : []);
  const currentText = textMap[currentQIndex] || '';
  const currentPartner = partnerMap[currentQIndex] || '';

  const handleSelectOption = (letter) => {
    if (hasSubmitted) return;
    setAnswersMap(prev => ({ ...prev, [currentQIndex]: letter }));
  };

  const handleSubmit = () => {
    setSubmittedMap(prev => ({ ...prev, [currentQIndex]: true }));
  };

  const handleResetCurrent = () => {
    setAnswersMap(prev => {
      const next = { ...prev };
      delete next[currentQIndex];
      return next;
    });
    setSubmittedMap(prev => {
      const next = { ...prev };
      delete next[currentQIndex];
      return next;
    });
    setOrderingMap(prev => {
      const next = { ...prev };
      delete next[currentQIndex];
      return next;
    });
    setTextMap(prev => {
      const next = { ...prev };
      delete next[currentQIndex];
      return next;
    });
  };

  const handleMoveOrderItem = (idx, direction) => {
    if (hasSubmitted) return;
    const items = [...currentOrdering];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const temp = items[idx];
    items[idx] = items[targetIdx];
    items[targetIdx] = temp;
    setOrderingMap(prev => ({ ...prev, [currentQIndex]: items }));
  };

  const openInNewTab = () => {
    const targetUrl = shareUrl ? `${shareUrl}?preview=true` : `#/student/${roomCode}?preview=true`;
    window.open(targetUrl, '_blank');
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
          maxWidth: deviceWidth === 'mobile' ? '460px' : '620px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(168, 85, 247, 0.15)',
          borderRadius: '24px',
          overflow: 'hidden',
          transition: 'max-width 0.25s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div style={{ 
          padding: '1rem 1.25rem', 
          background: 'rgba(255, 255, 255, 0.03)', 
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)', fontSize: '0.72rem' }}>
                📱 {lang === 'zh' ? '學生端畫面檢測' : 'Student View Inspection'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {roomCode}
              </span>
            </div>
            <h3 style={{ fontSize: '1rem', margin: '0.2rem 0 0 0', fontWeight: 600, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activity?.title || 'Activity Preview'}
            </h3>
          </div>

          {/* Quick Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Device width toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '2px' }}>
              <button
                type="button"
                className="btn-icon"
                style={{ 
                  padding: '0.25rem 0.4rem', 
                  borderRadius: '6px', 
                  background: deviceWidth === 'mobile' ? 'rgba(168, 85, 247, 0.3)' : 'transparent',
                  color: deviceWidth === 'mobile' ? '#c084fc' : 'var(--text-muted)'
                }}
                onClick={() => setDeviceWidth('mobile')}
                title={lang === 'zh' ? '手機視角 (390px)' : 'Mobile view'}
              >
                <Smartphone size={14} />
              </button>
              <button
                type="button"
                className="btn-icon"
                style={{ 
                  padding: '0.25rem 0.4rem', 
                  borderRadius: '6px', 
                  background: deviceWidth === 'tablet' ? 'rgba(168, 85, 247, 0.3)' : 'transparent',
                  color: deviceWidth === 'tablet' ? '#c084fc' : 'var(--text-muted)'
                }}
                onClick={() => setDeviceWidth('tablet')}
                title={lang === 'zh' ? '平板視角 (560px)' : 'Tablet view'}
              >
                <Tablet size={14} />
              </button>
            </div>

            {/* Open in new tab */}
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.72rem', height: '28px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              onClick={openInNewTab}
              title={lang === 'zh' ? '在新分頁開啟獨立學生頁面' : 'Open in new tab'}
            >
              <ExternalLink size={12} /> {lang === 'zh' ? '獨立分頁' : 'New Tab'}
            </button>

            {/* Close button */}
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              style={{ padding: '0.35rem', height: '28px', width: '28px' }}
              onClick={onClose}
              title={lang === 'zh' ? '關閉預覽' : 'Close'}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Multi-Question Navigation (if > 1 question) */}
        {questions.length > 1 && (
          <div style={{ 
            padding: '0.5rem 1rem', 
            background: 'rgba(255, 255, 255, 0.02)', 
            borderBottom: '1px solid var(--border-light)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            fontSize: '0.8rem'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', height: '26px' }}
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(prev => prev - 1)}
            >
              <ChevronLeft size={13} /> {lang === 'zh' ? '上一題' : 'Prev'}
            </button>

            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              {lang === 'zh' ? `第 ${currentQIndex + 1} / ${questions.length} 題` : `Question ${currentQIndex + 1} of ${questions.length}`}
            </span>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', height: '26px' }}
              disabled={currentQIndex === questions.length - 1}
              onClick={() => setCurrentQIndex(prev => prev + 1)}
            >
              {lang === 'zh' ? '下一題' : 'Next'} <ChevronRight size={13} />
            </button>
          </div>
        )}

        {/* Mock Phone Status & Screen Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {currentQ ? (
            <div className="glass-card animate-fade-in" style={{ 
              padding: '1.25rem', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              {/* Question Meta Header */}
              <div className="flex-between" style={{ marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-light)' }}>
                <span className="badge badge-indigo" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  {qType === 'ccq' ? '❓ CCQ 觀念檢核' : 
                   qType === 'game' ? '🎮 GAME 限時搶答' : 
                   qType === 'poll' ? '📊 POLL 即時投票' : 
                   qType === 'ordering' ? '🔢 ORDERING 流程排序' : 
                   qType === 'pair' ? '👥 PAIR 雙人討論' : 
                   qType === 'wordcloud' ? '☁️ WORDCLOUD 文字雲' : qType.toUpperCase()}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem', height: '24px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    onClick={handleResetCurrent}
                    title={lang === 'zh' ? '重設此題作答狀態' : 'Reset answering state'}
                  >
                    <RefreshCw size={11} /> {lang === 'zh' ? '重新作答' : 'Reset'}
                  </button>
                  {hasSubmitted && (
                    <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.2rem 0.45rem' }}>
                      ✓ 已送出
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <h3 style={{ fontSize: '1.05rem', lineHeight: '1.5', fontWeight: 600, marginBottom: '1.25rem' }}>
                <FormattedMarkdown text={currentQ.questionText} />
              </h3>

              {/* Multiple Choice (CCQ, Game, Poll) */}
              {(qType === 'ccq' || qType === 'game' || qType === 'poll') && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                    {(currentQ.options || []).map((opt, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      const isSelected = selectedAnswer === letter;
                      const isCorrect = currentQ.correctAnswer === letter;

                      // Post-submission styling
                      let btnBorder = '1px solid var(--border-light)';
                      let btnBg = 'rgba(255, 255, 255, 0.04)';
                      let textColor = 'var(--text-primary)';

                      if (hasSubmitted) {
                        if (isCorrect) {
                          btnBorder = '1.5px solid #10b981';
                          btnBg = 'rgba(16, 185, 129, 0.12)';
                          textColor = '#6ee7b7';
                        } else if (isSelected && !isCorrect) {
                          btnBorder = '1.5px solid rgba(239, 68, 68, 0.6)';
                          btnBg = 'rgba(239, 68, 68, 0.1)';
                          textColor = '#fca5a5';
                        }
                      } else if (isSelected) {
                        btnBorder = '1.5px solid var(--color-indigo)';
                        btnBg = 'rgba(99, 102, 241, 0.18)';
                      }

                      return (
                        <div
                          key={letter}
                          className={`option-btn ${isSelected && !hasSubmitted ? 'selected' : ''}`}
                          style={{
                            padding: '0.85rem 1rem',
                            border: btnBorder,
                            background: btnBg,
                            cursor: hasSubmitted ? 'default' : 'pointer'
                          }}
                          onClick={() => handleSelectOption(letter)}
                        >
                          <span 
                            className="option-letter"
                            style={{
                              width: '28px',
                              height: '28px',
                              fontSize: '0.85rem',
                              background: hasSubmitted && isCorrect 
                                ? '#10b981' 
                                : hasSubmitted && isSelected && !isCorrect 
                                  ? '#ef4444' 
                                  : isSelected ? 'var(--color-indigo)' : 'rgba(255,255,255,0.08)',
                              color: isSelected || (hasSubmitted && isCorrect) ? '#fff' : 'var(--text-secondary)'
                            }}
                          >
                            {letter}
                          </span>

                          <span style={{ fontSize: '0.92rem', color: textColor, flex: 1, lineHeight: '1.4' }}>
                            <FormattedMarkdown text={String(opt).replace(/^(\(?[A-Za-z]\)?[.:、\)\-\s]+|Option\s+[A-Za-z][:.\-\s]*)/i, '').trim() || opt} />
                          </span>

                          {hasSubmitted && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              {isSelected && (
                                <span className="badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', background: isCorrect ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)', color: isCorrect ? '#6ee7b7' : '#fca5a5' }}>
                                  {isCorrect ? '你的選擇 🎯' : '你的選擇 ❌'}
                                </span>
                              )}
                              {isCorrect && (
                                <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                                  正確答案 ✅
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!hasSubmitted ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                      onClick={handleSubmit}
                      disabled={!selectedAnswer}
                    >
                      {lang === 'zh' ? '送出答案 (模擬作答)' : 'Submit Answer (Simulate)'} <CornerDownRight size={16} />
                    </button>
                  ) : (
                    <div className="animate-fade-in" style={{ marginTop: '1rem' }}>
                      {/* Explanation Block if available */}
                      {currentQ.explanation ? (
                        <div style={{ 
                          padding: '0.85rem 1rem', 
                          borderRadius: '10px', 
                          background: 'rgba(16, 185, 129, 0.08)', 
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          fontSize: '0.85rem',
                          lineHeight: '1.5'
                        }}>
                          <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle size={14} /> {lang === 'zh' ? '題目解析與說明：' : 'Explanation:'}
                          </div>
                          <div style={{ color: 'var(--text-secondary)' }}>
                            <FormattedMarkdown text={currentQ.explanation} />
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          🎉 {lang === 'zh' ? '作答結果已揭曉' : 'Result revealed'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Ordering Question */}
              {qType === 'ordering' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {currentOrdering.map((item, idx) => (
                      <div
                        key={idx}
                        className="glass-card"
                        style={{
                          padding: '0.75rem 0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-light)',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-pink)', fontSize: '0.85rem' }}>
                            {idx + 1}.
                          </span>
                          <span style={{ fontSize: '0.9rem' }}>
                            <FormattedMarkdown text={item} />
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.2rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-icon"
                            style={{ padding: '0.25rem' }}
                            disabled={idx === 0 || hasSubmitted}
                            onClick={() => handleMoveOrderItem(idx, 'up')}
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-icon"
                            style={{ padding: '0.25rem' }}
                            disabled={idx === currentOrdering.length - 1 || hasSubmitted}
                            onClick={() => handleMoveOrderItem(idx, 'down')}
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!hasSubmitted ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem' }}
                      onClick={handleSubmit}
                    >
                      {lang === 'zh' ? '送出排序' : 'Submit Order'} <CornerDownRight size={16} />
                    </button>
                  ) : (
                    <span className="badge badge-success" style={{ width: '100%', display: 'block', textAlign: 'center', padding: '0.5rem' }}>
                      ✓ 排序已送出
                    </span>
                  )}
                </div>
              )}

              {/* WordCloud Question */}
              {qType === 'wordcloud' && (
                <div>
                  <textarea
                    className="input-field"
                    style={{ width: '100%', minHeight: '80px', padding: '0.75rem', fontSize: '0.95rem', resize: 'none', marginBottom: '0.85rem' }}
                    value={currentText}
                    onChange={(e) => setTextMap(prev => ({ ...prev, [currentQIndex]: e.target.value }))}
                    placeholder="請輸入關鍵字詞彙（如：品質, 測試, 自動化）..."
                    disabled={hasSubmitted}
                  />
                  {!hasSubmitted ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem' }}
                      disabled={!currentText.trim()}
                      onClick={handleSubmit}
                    >
                      {lang === 'zh' ? '送出詞彙' : 'Submit Words'} <CornerDownRight size={16} />
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '0.85rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                      <span className="badge badge-indigo">✨ 已送出詞彙：{currentText}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Pair Discussion */}
              {qType === 'pair' && (
                <div>
                  {currentQ.description && (
                    <div style={{ padding: '0.75rem 0.9rem', marginBottom: '1rem', background: 'rgba(6, 182, 212, 0.08)', borderLeft: '3px solid #06b6d4', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <FormattedMarkdown text={currentQ.description} />
                    </div>
                  )}
                  <input
                    type="text"
                    className="input-field"
                    style={{ width: '100%', marginBottom: '0.75rem', fontSize: '0.9rem' }}
                    placeholder="夥伴姓名（例如：同桌同學）"
                    value={currentPartner}
                    onChange={(e) => setPartnerMap(prev => ({ ...prev, [currentQIndex]: e.target.value }))}
                    disabled={hasSubmitted}
                  />
                  <textarea
                    className="input-field"
                    style={{ width: '100%', minHeight: '90px', padding: '0.75rem', fontSize: '0.92rem', resize: 'none', marginBottom: '0.85rem' }}
                    placeholder="請輸入雙人討論重點摘要..."
                    value={currentText}
                    onChange={(e) => setTextMap(prev => ({ ...prev, [currentQIndex]: e.target.value }))}
                    disabled={hasSubmitted}
                  />
                  {!hasSubmitted ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem' }}
                      disabled={!currentText.trim()}
                      onClick={handleSubmit}
                    >
                      {lang === 'zh' ? '送出討論總結' : 'Submit Summary'} <CornerDownRight size={16} />
                    </button>
                  ) : (
                    <span className="badge badge-success" style={{ width: '100%', display: 'block', textAlign: 'center', padding: '0.5rem' }}>
                      ✓ 討論內容已送出
                    </span>
                  )}
                </div>
              )}

              {/* Short Answer */}
              {qType === 'short' && (
                <div>
                  <textarea
                    className="input-field"
                    style={{ width: '100%', minHeight: '90px', padding: '0.75rem', fontSize: '0.92rem', resize: 'none', marginBottom: '0.85rem' }}
                    placeholder="請輸入你的簡短回答..."
                    value={currentText}
                    onChange={(e) => setTextMap(prev => ({ ...prev, [currentQIndex]: e.target.value }))}
                    disabled={hasSubmitted}
                  />
                  {!hasSubmitted ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem' }}
                      disabled={!currentText.trim()}
                      onClick={handleSubmit}
                    >
                      {lang === 'zh' ? '送出回答' : 'Submit'} <CornerDownRight size={16} />
                    </button>
                  ) : (
                    <span className="badge badge-success" style={{ width: '100%', display: 'block', textAlign: 'center', padding: '0.5rem' }}>
                      ✓ 回答已送出
                    </span>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              {lang === 'zh' ? '此活動目前無題目' : 'No questions found in this activity.'}
            </div>
          )}

          {/* Bottom Hint */}
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '0.5rem' }}>
            💡 {lang === 'zh' 
              ? '此預覽模式完全模擬學生端手機互動，方便您檢查題目選項、排版與答案揭曉效果。' 
              : 'Simulates student screen for layout, option, and answer verification.'}
          </div>
        </div>

      </div>
    </div>
  );
}
