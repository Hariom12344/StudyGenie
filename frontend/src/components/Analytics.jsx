import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Compass, Clock, Award, Printer, ArrowRight, BookOpen, User } from 'lucide-react';
import { API } from '../services/api';

export default function Analytics() {
  const [stats, setStats] = useState({ xp: 320, streak: 5, coins: 45, level: 1 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [scope, setScope] = useState('National'); // National, State, College
  const [timeline, setTimeline] = useState('Weekly'); // Daily, Weekly, Monthly

  useEffect(() => {
    // Load local stats
    const currentStats = API.stats.getLocalStats();
    setStats(currentStats);
    
    // Load leaderboard
    API.stats.getLeaderboard().then(res => {
      setLeaderboard(res.leaderboard);
    });
  }, []);

  const handleDownloadReport = () => {
    window.print(); // Printable CSS classes will format this elegantly
  };

  return (
    <div className="space-y-6 animate-fade-in print:bg-white print:text-black">
      
      {/* Print Page Header - Hidden during web view */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-3xl font-extrabold text-slate-800">ExamAce Academic Performance Report</h1>
        <p className="text-sm text-slate-500">Student Profile: Siddharth Roy | Exam: JEE Main Prep</p>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-card border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white font-heading">Performance Analytics & Rankings</h2>
          <p className="text-xs text-slate-400 mt-0.5">Analyze strengths, calibrate speed accuracy rates, and track leaderboard status.</p>
        </div>
        
        <button
          onClick={handleDownloadReport}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
        >
          <Printer className="h-4.5 w-4.5" />
          Export PDF Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Analytics Data */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detailed stats grids */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-card border shadow-sm space-y-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Average Test Speed</span>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary-500" />
                <h3 className="text-2xl font-bold font-heading text-slate-800 dark:text-white">45s / Q</h3>
              </div>
              <p className="text-[10px] text-emerald-500 font-semibold">• 12% faster than last week</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border shadow-sm space-y-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Concept Accuracy</span>
              <div className="flex items-center gap-2">
                <BarChart2 className="h-6 w-6 text-emerald-500" />
                <h3 className="text-2xl font-bold font-heading text-emerald-500">82.4%</h3>
              </div>
              <p className="text-[10px] text-emerald-500 font-semibold">• Solved 45 correct answers</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border shadow-sm space-y-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Strongest Subject</span>
              <div className="flex items-center gap-2">
                <Compass className="h-6 w-6 text-indigo-500" />
                <h3 className="text-2xl font-bold font-heading text-slate-800 dark:text-white">Physics</h3>
              </div>
              <p className="text-[10px] text-indigo-500 font-semibold">• 90% topic rating</p>
            </div>
          </div>

          {/* SVG Custom Progress Graph Chart */}
          <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white font-heading text-sm">Monthly Progress Graph (XP gained)</h3>
            
            <div className="w-full h-48 bg-slate-50 dark:bg-slate-900/40 rounded-xl relative p-4 flex items-end justify-between border">
              
              {/* Grid Lines */}
              <div className="absolute inset-y-4 inset-x-8 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-t w-full"></div>
                <div className="border-t w-full"></div>
                <div className="border-t w-full"></div>
              </div>

              {/* Graphical representation using custom Tailwind divs */}
              {[
                { label: 'Week 1', height: '35%', xp: 120 },
                { label: 'Week 2', height: '55%', xp: 210 },
                { label: 'Week 3', height: '48%', xp: 180 },
                { label: 'Week 4', height: '80%', xp: 320 }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                  <div className="text-[10px] font-semibold text-slate-400 opacity-0 hover:opacity-100 transition-all absolute -top-5">
                    {bar.xp} XP
                  </div>
                  <div 
                    className="w-8 bg-gradient-to-t from-primary-650 to-primary-400 hover:from-primary-500 hover:to-indigo-500 rounded-t-md transition-all duration-700 glow-primary" 
                    style={{ height: bar.height }}
                  ></div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject strength details */}
          <div className="p-6 rounded-2xl bg-card border shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white font-heading text-sm mb-4">Subject-wise Performance Rating</h3>
            
            <div className="space-y-4">
              {[
                { name: 'Physics (Electrostatics, Kinematics)', rating: 90, color: 'bg-indigo-500' },
                { name: 'Mathematics (Calculus, Trigonometry)', rating: 78, color: 'bg-primary-500' },
                { name: 'Chemistry (Chemical Bonding, Organic)', rating: 65, color: 'bg-amber-500' }
              ].map((sub, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-350">{sub.name}</span>
                    <span className="text-slate-500">{sub.rating}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`${sub.color} h-full rounded-full`} style={{ width: `${sub.rating}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested improvements & Weak areas detection */}
          <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 shadow-sm">
            <h3 className="font-bold text-red-700 dark:text-red-400 text-sm mb-2">Weak Topics & Remediation Paths</h3>
            <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-350">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/10">
                <span className="font-bold text-red-700 dark:text-red-400">• VSEPR Organic Formulations (Chemistry)</span>
                <p className="mt-1">Accuracy is 45%. Recommended action: Solve 10 medium MCQ questions and ask the doubt solver to check VSEPR boundary rules.</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/10">
                <span className="font-bold text-red-700 dark:text-red-400">• Trigonometric Limits (Mathematics)</span>
                <p className="mt-1">Accuracy is 60%. Recommended action: Study limits mind map and attempt standard Class 12 board formulas quiz.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Global Leaderboard (Module 14) */}
        <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-6 print:hidden">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 dark:text-white font-heading text-base flex items-center gap-1">
              <Award className="h-5 w-5 text-amber-500" />
              Leaderboard Standings
            </h3>
            <p className="text-xs text-slate-400">Competitive rankings across target scopes.</p>
          </div>

          {/* Scope Filters */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            {['National', 'State', 'College'].map(s => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  scope === s 
                    ? 'bg-primary-500 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Timeline Filters */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b pb-2">
            <span>Timeline</span>
            <div className="flex gap-3">
              {['Daily', 'Weekly', 'Monthly'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeline(t)}
                  className={`hover:text-primary-500 transition-all ${timeline === t ? 'text-primary-500 border-b border-primary-500' : ''}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard entries */}
          <div className="space-y-3">
            {leaderboard.map((student, idx) => {
              const isUser = student.name === 'Siddharth Roy';
              return (
                <div 
                  key={student.id} 
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isUser 
                      ? 'bg-primary-500/5 border-primary-500/30' 
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-transparent hover:border-slate-100 dark:hover:border-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                      idx === 0 
                        ? 'bg-yellow-500 text-white' 
                        : idx === 1 
                          ? 'bg-slate-300 text-slate-800' 
                          : idx === 2 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-white flex items-center gap-1">
                          {student.name}
                          {isUser && <span className="text-[9px] bg-primary-500 text-white px-1 rounded uppercase">You</span>}
                        </div>
                        <div className="text-[10px] text-slate-400">Level {student.level}</div>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold font-heading text-slate-700 dark:text-white">
                    {student.score} pts
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-center text-[10px] text-slate-400 italic">
            *Leaderboard scores reset every {timeline.toLowerCase()} cycle.
          </div>
        </div>

      </div>
    </div>
  );
}
