import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, Sparkles, RefreshCw, ChevronRight, CheckSquare } from 'lucide-react';
import { API } from '../services/api';

export default function StudyPlanner() {
  const [examName, setExamName] = useState('JEE Main');
  const [availableHours, setAvailableHours] = useState(4);
  const [weakTopics, setWeakTopics] = useState('Organic reaction mechanisms, Mechanics integration');
  const [daysRemaining, setDaysRemaining] = useState(30);
  
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);

    try {
      const res = await API.ai.generateStudyPlan({
        examName,
        availableHours,
        weakTopics,
        daysRemaining
      });
      setPlan(res.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-card border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white font-heading">AI Study Planner</h2>
          <p className="text-xs text-slate-400 mt-0.5">Generate daily calendars and revision paths based on weak concepts.</p>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 border border-indigo-500/20 shadow-md animate-pulse">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Plan parameters Form */}
        <div className="md:col-span-1 p-6 rounded-2xl bg-card border shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 dark:text-white font-heading text-sm mb-4">Planner Constraints</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Target Assessment</label>
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border rounded-xl outline-none focus:border-primary-500 text-sm"
              >
                {['JEE Main', 'JEE Advanced', 'NEET UG', 'Class 12 Boards', 'Placement Aptitude', 'SSC CGL'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Study Hours / Day</label>
              <input
                type="number"
                min={1}
                max={16}
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-transparent border rounded-xl outline-none focus:border-primary-500 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Days Remaining</label>
              <input
                type="number"
                min={1}
                max={365}
                value={daysRemaining}
                onChange={(e) => setDaysRemaining(Number(e.target.value))}
                className="w-full px-3 py-2 bg-transparent border rounded-xl outline-none focus:border-primary-500 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Weak Topics / subjects</label>
              <textarea
                rows={3}
                placeholder="e.g. chemical formulas, speed tests..."
                value={weakTopics}
                onChange={(e) => setWeakTopics(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border rounded-xl outline-none focus:border-primary-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-primary-650 to-indigo-650 text-white rounded-xl text-xs font-bold shadow-md hover-lift flex items-center justify-center gap-1.5 transition-all"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? 'Analyzing schedules...' : 'Generate AI Plan'}
            </button>
          </form>
        </div>

        {/* Right Column: Output result sheet */}
        <div className="md:col-span-2 space-y-6">
          {plan ? (
            <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-slate-800 dark:text-white font-heading text-base flex items-center gap-1.5">
                  <Calendar className="h-5 w-5 text-primary-500" />
                  Your Customized Schedule
                </h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded uppercase font-semibold">
                  Plan Active
                </span>
              </div>
              
              <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-350 whitespace-pre-wrap font-sans space-y-4">
                {plan}
              </div>
            </div>
          ) : loading ? (
            <div className="p-10 rounded-2xl bg-card border shadow-sm text-center flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="h-10 w-10 text-primary-500 animate-spin" />
              <p className="text-slate-500 text-sm font-semibold">Gemini is structuring daily modules and revision checkpoints...</p>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-card border shadow-sm text-center space-y-3">
              <Calendar className="h-14 w-14 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="font-bold text-slate-700 dark:text-white text-base">No active plan generated yet</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Fill out the target constraints on the left (preferred exam, days remaining) and let AI design a tailored revision calendar.
              </p>
            </div>
          )}

          {/* Quick tracker tips */}
          <div className="p-5 rounded-2xl bg-slate-500/5 border text-xs leading-relaxed text-slate-500 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-emerald-500" />
              How to maximize your study plan:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 font-medium">
              <div>• Check off daily goals on the dashboard to earn XP.</div>
              <div>• Take a mini topic quiz for weak topics every 3 days.</div>
              <div>• Ask the doubt solver to explain complex formulas.</div>
              <div>• Review flashcard decks during breaks.</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
