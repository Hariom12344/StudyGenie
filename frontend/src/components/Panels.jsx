import React, { useState } from 'react';
import { Shield, UserCheck, Bell, Plus, BookOpen, CheckCircle, RefreshCw, Layers, Sparkles, TrendingUp } from 'lucide-react';
import { API } from '../services/api';

export default function Panels({ role }) {
  const [activeTab, setActiveTab] = useState(role === 'Admin' ? 'users' : 'addQuestion');

  // Teacher Forms State
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('MCQ');
  const [qDiff, setQDiff] = useState('Medium');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [qCorrect, setQCorrect] = useState('A');
  const [qSolution, setQSolution] = useState('');
  const [message, setMessage] = useState('');

  // Admin Forms State
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState('Announcement');
  const [users, setUsers] = useState([
    { id: 1, name: 'Siddharth Roy', email: 'sid@examace.com', role: 'Student' },
    { id: 2, name: 'Dr. Anita Mehta', email: 'anita@examace.com', role: 'Teacher' }
  ]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.teacher.addQuestion({
        questionText: qText,
        type: qType,
        difficulty: qDiff,
        option_a: optA,
        option_b: optB,
        option_c: optC,
        option_d: optD,
        correct_answer: qCorrect,
        solution: qSolution
      });
      setMessage(res.message);
      setQText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setQSolution('');
    } catch (err) {
      setMessage('Error inserting question.');
    }
  };

  const handleToggleRole = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextRole = u.role === 'Student' ? 'Teacher' : 'Student';
        return { ...u, role: nextRole };
      }
      return u;
    }));
    setMessage('User role updated successfully.');
  };

  const handlePublishAlert = (e) => {
    e.preventDefault();
    if (!alertText.trim()) return;
    setMessage(`System alert: "${alertText}" published successfully to all devices.`);
    setAlertText('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-card border shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white font-heading">
            {role === 'Admin' ? 'System Admin Command Center' : 'Instructor Educator Panel'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Role Authorization Access: [{role}] level cleared.</p>
        </div>
        <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20 shadow-md">
          <Shield className="h-5 w-5" />
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold text-center animate-fade-in">
          {message}
        </div>
      )}

      {/* ADMIN CONTROLS */}
      {role === 'Admin' && (
        <div className="space-y-6">
          {/* Subtabs */}
          <div className="flex gap-2 border-b pb-1">
            <button 
              onClick={() => { setActiveTab('users'); setMessage(''); }}
              className={`px-4 py-2 border-b-2 text-xs font-bold transition-all ${activeTab === 'users' ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-400'}`}
            >
              Manage Users & Roles
            </button>
            <button 
              onClick={() => { setActiveTab('alerts'); setMessage(''); }}
              className={`px-4 py-2 border-b-2 text-xs font-bold transition-all ${activeTab === 'alerts' ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-400'}`}
            >
              Publish System Alerts
            </button>
          </div>

          {activeTab === 'users' && (
            <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-4">
              <h3 className="font-bold text-sm">System Database Directory</h3>
              <div className="space-y-3">
                {users.map(u => (
                  <div key={u.id} className="p-3.5 rounded-xl border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{u.email} • Current: [{u.role}]</div>
                    </div>
                    
                    <button
                      onClick={() => handleToggleRole(u.id)}
                      className="px-3 py-1.5 border border-primary-500/30 text-primary-500 hover:bg-primary-500/10 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Toggle Student / Teacher
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <form onSubmit={handlePublishAlert} className="p-6 rounded-2xl bg-card border shadow-sm max-w-lg space-y-4">
              <h3 className="font-bold text-sm">Distribute Alert Broadcast</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Alert Category</label>
                  <select 
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-lg text-xs bg-transparent"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Test Reminder">Test Reminder</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Alert Message Body</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter announcement text to propagate..."
                    value={alertText}
                    onChange={(e) => setAlertText(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-lg text-xs bg-transparent outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg text-xs font-bold hover:bg-primary-600 transition-all flex items-center gap-1"
              >
                <Bell className="h-4 w-4" />
                Publish System Alert
              </button>
            </form>
          )}
        </div>
      )}

      {/* TEACHER CONTROLS */}
      {role === 'Teacher' && (
        <form onSubmit={handleAddQuestion} className="p-6 rounded-2xl bg-card border shadow-sm space-y-4 max-w-2xl">
          <h3 className="font-bold text-slate-800 dark:text-white text-base font-heading">Add Question to Exam Bank</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Question Format</label>
              <select 
                value={qType} 
                onChange={(e) => setQType(e.target.value)}
                className="w-full mt-1 p-2.5 border rounded-lg text-xs bg-transparent"
              >
                <option value="MCQ">Multiple Choice (MCQ)</option>
                <option value="Numerical">Numerical</option>
                <option value="Coding">Coding</option>
                <option value="Descriptive">Descriptive</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Difficulty Scale</label>
              <select 
                value={qDiff} 
                onChange={(e) => setQDiff(e.target.value)}
                className="w-full mt-1 p-2.5 border rounded-lg text-xs bg-transparent"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Question Text</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. What is the derivative of x^2 + 5x?"
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              className="w-full mt-1 p-2.5 border rounded-lg text-xs bg-transparent outline-none focus:border-primary-500"
            />
          </div>

          {qType === 'MCQ' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {['A', 'B', 'C', 'D'].map(key => (
                <div key={key}>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Option {key}</label>
                  <input
                    type="text"
                    required
                    placeholder={`Option ${key} text`}
                    value={key === 'A' ? optA : key === 'B' ? optB : key === 'C' ? optC : optD}
                    onChange={(e) => {
                      if (key === 'A') setOptA(e.target.value);
                      else if (key === 'B') setOptB(e.target.value);
                      else if (key === 'C') setOptC(e.target.value);
                      else setOptD(e.target.value);
                    }}
                    className="w-full mt-1 p-2.5 border rounded-lg text-xs bg-transparent outline-none focus:border-primary-500"
                  />
                </div>
              ))}
              
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Correct Option</label>
                <select 
                  value={qCorrect} 
                  onChange={(e) => setQCorrect(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-lg text-xs bg-transparent"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>
            </div>
          )}

          {qType !== 'MCQ' && (
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Correct Answer Reference</label>
              <input
                type="text"
                required
                placeholder="e.g. 2x + 5"
                value={qCorrect}
                onChange={(e) => setQCorrect(e.target.value)}
                className="w-full mt-1 p-2.5 border rounded-lg text-xs bg-transparent outline-none focus:border-primary-500"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Detailed Explanatory Solution</label>
            <textarea
              rows={3}
              placeholder="Provide solution steps for student review logs..."
              value={qSolution}
              onChange={(e) => setQSolution(e.target.value)}
              className="w-full mt-1 p-2.5 border rounded-lg text-xs bg-transparent outline-none focus:border-primary-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Publish Question
          </button>
        </form>
      )}

    </div>
  );
}
