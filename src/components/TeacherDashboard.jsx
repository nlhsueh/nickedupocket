import React, { useState } from 'react';
import { 
  Play, Plus, Trash2, Edit2, Download, Upload, RotateCcw, 
  FileText, BarChart2, ListOrdered, Gamepad2, Check, X, HelpCircle, Save 
} from 'lucide-react';
import { DEFAULT_ACTIVITIES } from '../utils/demoData';

export default function TeacherDashboard({ activities, setActivities, onLaunch }) {
  const [editingActivity, setEditingActivity] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Load defaults if empty
  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset to default activities? All custom questions will be overwritten.')) {
      setActivities(DEFAULT_ACTIVITIES);
      localStorage.setItem('nickpocket_activities', JSON.stringify(DEFAULT_ACTIVITIES));
    }
  };

  // Delete activity
  const deleteActivity = (id) => {
    if (window.confirm('Delete this activity?')) {
      const updated = activities.filter(a => a.id !== id);
      setActivities(updated);
      localStorage.setItem('nickpocket_activities', JSON.stringify(updated));
    }
  };

  // Export to JSON
  const exportActivities = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "nickpocket_activities.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import from JSON
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          // Basic validation
          const isValid = imported.every(item => item.id && item.type && item.title && Array.isArray(item.questions));
          if (isValid) {
            const merged = [...imported, ...activities.filter(a => !imported.some(imp => imp.id === a.id))];
            setActivities(merged);
            localStorage.setItem('nickpocket_activities', JSON.stringify(merged));
            alert('Activities imported successfully!');
          } else {
            alert('Invalid file format. Make sure the JSON represents an array of valid activities.');
          }
        } else {
          alert('Invalid JSON structure. Must be an array.');
        }
      } catch (err) {
        alert('Error parsing JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Create new activity
  const createNewActivity = (type) => {
    const newAct = {
      id: `act_${Date.now()}`,
      type,
      title: `New ${type.toUpperCase()} Activity`,
      description: `Description for ${type} activity`,
      questions: [
        type === 'ordering' 
          ? { id: `q_${Date.now()}_1`, questionText: 'Arrange these items in order:', items: ['Item 1', 'Item 2', 'Item 3'] }
          : { 
              id: `q_${Date.now()}_1`, 
              questionText: 'New Question Text', 
              options: ['Option A', 'Option B', 'Option C', 'Option D'], 
              correctAnswer: 'A',
              timeLimit: 15
            }
      ]
    };
    setEditingActivity(JSON.parse(JSON.stringify(newAct)));
  };

  // Save edited activity
  const saveActivity = () => {
    if (!editingActivity.title.trim()) {
      alert('Activity title is required.');
      return;
    }
    
    let updated;
    const exists = activities.some(a => a.id === editingActivity.id);
    if (exists) {
      updated = activities.map(a => a.id === editingActivity.id ? editingActivity : a);
    } else {
      updated = [editingActivity, ...activities];
    }
    
    setActivities(updated);
    localStorage.setItem('nickpocket_activities', JSON.stringify(updated));
    setEditingActivity(null);
  };

  // Question editing helpers
  const updateQuestionText = (index, val) => {
    const updated = { ...editingActivity };
    updated.questions[index].questionText = val;
    setEditingActivity(updated);
  };

  const updateOptionText = (qIndex, oIndex, val) => {
    const updated = { ...editingActivity };
    updated.questions[qIndex].options[oIndex] = val;
    setEditingActivity(updated);
  };

  const setCorrectAnswer = (qIndex, letter) => {
    const updated = { ...editingActivity };
    updated.questions[qIndex].correctAnswer = letter;
    setEditingActivity(updated);
  };

  const updateTimeLimit = (qIndex, seconds) => {
    const updated = { ...editingActivity };
    updated.questions[qIndex].timeLimit = parseInt(seconds) || 10;
    setEditingActivity(updated);
  };

  // Ordering items helpers
  const updateOrderItemText = (qIndex, iIndex, val) => {
    const updated = { ...editingActivity };
    updated.questions[qIndex].items[iIndex] = val;
    setEditingActivity(updated);
  };

  const addOrderItem = (qIndex) => {
    const updated = { ...editingActivity };
    updated.questions[qIndex].items.push(`New Item ${updated.questions[qIndex].items.length + 1}`);
    setEditingActivity(updated);
  };

  const removeOrderItem = (qIndex, iIndex) => {
    const updated = { ...editingActivity };
    if (updated.questions[qIndex].items.length <= 2) {
      alert('Must have at least 2 items to sort.');
      return;
    }
    updated.questions[qIndex].items.splice(iIndex, 1);
    setEditingActivity(updated);
  };

  // Add question to activity
  const addQuestion = () => {
    const type = editingActivity.type;
    const newQ = type === 'ordering'
      ? { id: `q_${Date.now()}_${editingActivity.questions.length + 1}`, questionText: 'Arrange these items in order:', items: ['Item A', 'Item B', 'Item C'] }
      : { 
          id: `q_${Date.now()}_${editingActivity.questions.length + 1}`, 
          questionText: 'Question Text', 
          options: ['Option A', 'Option B', 'Option C', 'Option D'], 
          correctAnswer: 'A',
          timeLimit: 15
        };
    
    setEditingActivity({
      ...editingActivity,
      questions: [...editingActivity.questions, newQ]
    });
  };

  const removeQuestion = (qIndex) => {
    if (editingActivity.questions.length <= 1) {
      alert('Activity must contain at least 1 question.');
      return;
    }
    const updated = { ...editingActivity };
    updated.questions.splice(qIndex, 1);
    setEditingActivity(updated);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'ccq': return <HelpCircle style={{ color: 'var(--color-indigo)' }} />;
      case 'poll': return <BarChart2 style={{ color: 'var(--color-violet)' }} />;
      case 'ordering': return <ListOrdered style={{ color: 'var(--color-pink)' }} />;
      case 'game': return <Gamepad2 style={{ color: 'var(--color-warning)' }} />;
      default: return <FileText />;
    }
  };

  const filteredActivities = activities.filter(a => filterType === 'all' || a.type === filterType);

  return (
    <div className="container animate-slide-up">
      {/* Header bar */}
      <div className="flex-between glass-card" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>NickPocket Edu</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Interactive classroom suite (CCQ, Poll, Ordering, Game)</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={exportActivities} title="Export Questions">
            <Download size={18} /> Export
          </button>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }} title="Import Questions">
            <Upload size={18} /> Import
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          <button className="btn btn-danger" onClick={resetToDefaults} title="Reset to Defaults">
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>

      {/* Main dashboard content */}
      {!editingActivity ? (
        <>
          {/* Create section & filter tab */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Create buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => createNewActivity('ccq')}>
                <Plus size={18} /> CCQ
              </button>
              <button className="btn btn-primary" onClick={() => createNewActivity('poll')} style={{ background: 'linear-gradient(135deg, var(--color-violet) 0%, var(--color-pink) 100%)', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.25)' }}>
                <Plus size={18} /> Poll
              </button>
              <button className="btn btn-primary" onClick={() => createNewActivity('ordering')} style={{ background: 'linear-gradient(135deg, var(--color-pink) 0%, #f43f5e 100%)', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.25)' }}>
                <Plus size={18} /> Ordering
              </button>
              <button className="btn btn-primary" onClick={() => createNewActivity('game')} style={{ background: 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)' }}>
                <Plus size={18} /> Game
              </button>
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'ccq', 'poll', 'ordering', 'game'].map(t => (
                <button 
                  key={t}
                  className={`btn ${filterType === t ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  onClick={() => setFilterType(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Activities list grid */}
          <div className="grid-2">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((act) => (
                <div key={act.id} className="glass-card flex-between" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="glass-card" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      {getActivityIcon(act.type)}
                    </div>
                    <div>
                      <span className={`badge ${
                        act.type === 'ccq' ? 'badge-indigo' : 
                        act.type === 'poll' ? 'badge-success' : 
                        act.type === 'ordering' ? 'badge-warning' : 'badge-danger'
                      }`} style={{ marginBottom: '0.25rem' }}>
                        {act.type}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{act.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {act.questions.length} Question{act.questions.length > 1 ? 's' : ''} • {act.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-success btn-icon" onClick={() => onLaunch(act)} title="Launch Session">
                      <Play size={18} fill="white" />
                    </button>
                    <button className="btn btn-secondary btn-icon" onClick={() => setEditingActivity(JSON.parse(JSON.stringify(act)))} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="btn btn-secondary btn-icon" onClick={() => deleteActivity(act.id)} title="Delete" style={{ color: '#f87171' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1.5rem' }}>
                <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No activities found matching this filter.</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Create a new activity above or reset to defaults.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Edit Section */
        <div className="glass-card animate-slide-up" style={{ padding: '2rem' }}>
          <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {getActivityIcon(editingActivity.type)}
              <h2 style={{ fontSize: '1.5rem' }}>Editing {editingActivity.type.toUpperCase()}: {editingActivity.title}</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setEditingActivity(null)}>
                <X size={18} /> Cancel
              </button>
              <button className="btn btn-primary" onClick={saveActivity}>
                <Save size={18} /> Save Activity
              </button>
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Activity Title</label>
              <input 
                type="text" 
                className="input-field" 
                value={editingActivity.title} 
                onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Activity Description</label>
              <input 
                type="text" 
                className="input-field" 
                value={editingActivity.description} 
                onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })} 
              />
            </div>
          </div>

          {/* Questions list */}
          <div>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Questions ({editingActivity.questions.length})</h3>
              <button className="btn btn-secondary" onClick={addQuestion}>
                <Plus size={16} /> Add Question
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {editingActivity.questions.map((q, qIndex) => (
                <div key={q.id || qIndex} className="glass-card animate-pop" style={{ borderLeft: '4px solid var(--color-indigo)', background: 'rgba(255,255,255,0.015)' }}>
                  <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: 'var(--text-secondary)' }}>Question #{qIndex + 1}</h4>
                    <button className="btn btn-danger btn-icon" onClick={() => removeQuestion(qIndex)} title="Delete Question">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Question Prompt</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. What is 2 + 2?"
                      value={q.questionText} 
                      onChange={(e) => updateQuestionText(qIndex, e.target.value)} 
                    />
                  </div>

                  {/* Rendering questions based on Type */}
                  {editingActivity.type === 'ordering' ? (
                    /* ORDERING OPTIONS */
                    <div>
                      <label className="form-label">Sequence Items (Write in the CORRECT order from top to bottom):</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        {q.items.map((item, itemIdx) => (
                          <div key={itemIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ minWidth: '24px', fontWeight: 'bold', color: 'var(--text-muted)' }}>{itemIdx + 1}.</span>
                            <input 
                              type="text" 
                              className="input-field" 
                              value={item} 
                              onChange={(e) => updateOrderItemText(qIndex, itemIdx, e.target.value)} 
                            />
                            <button className="btn btn-secondary btn-icon" style={{ color: '#f87171' }} onClick={() => removeOrderItem(qIndex, itemIdx)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-secondary" onClick={() => addOrderItem(qIndex)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <Plus size={14} /> Add Sequence Item
                      </button>
                    </div>
                  ) : (
                    /* CCQ / POLL / GAME OPTIONS */
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        {['A', 'B', 'C', 'D'].map((letter, idx) => (
                          <div key={letter} className="form-group" style={{ marginBottom: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                              <label className="form-label" style={{ marginBottom: 0 }}>Option {letter}</label>
                              {editingActivity.type !== 'poll' && (
                                <button 
                                  className="btn" 
                                  style={{ 
                                    padding: '0 0.4rem', 
                                    fontSize: '0.75rem', 
                                    background: q.correctAnswer === letter ? 'var(--color-success)' : 'transparent',
                                    borderColor: q.correctAnswer === letter ? 'transparent' : 'var(--border-light)',
                                    color: q.correctAnswer === letter ? 'white' : 'var(--text-secondary)'
                                  }}
                                  onClick={() => setCorrectAnswer(qIndex, letter)}
                                >
                                  {q.correctAnswer === letter ? 'Correct Answer' : 'Set Correct'}
                                </button>
                              )}
                            </div>
                            <input 
                              type="text" 
                              className="input-field" 
                              value={q.options[idx] || ''} 
                              onChange={(e) => updateOptionText(qIndex, idx, e.target.value)} 
                              placeholder={`Option ${letter}`}
                            />
                          </div>
                        ))}
                      </div>

                      {editingActivity.type === 'game' && (
                        <div className="form-group" style={{ maxWidth: '200px' }}>
                          <label className="form-label">Time Limit (Seconds)</label>
                          <select 
                            className="select-field" 
                            value={q.timeLimit || 15} 
                            onChange={(e) => updateTimeLimit(qIndex, e.target.value)}
                          >
                            <option value={10}>10 Seconds</option>
                            <option value={15}>15 Seconds</option>
                            <option value={20}>20 Seconds</option>
                            <option value={30}>30 Seconds</option>
                            <option value={45}>45 Seconds</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Brand footer */}
      <footer className="footer-branding">
        designed by <span>Nien-Lin Hsueh, Feng Chia University</span>
      </footer>
    </div>
  );
}
