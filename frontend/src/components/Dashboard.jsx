import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Shield, Award, Play, Flame, Sparkles, TrendingUp, Clock, CheckCircle2, ChevronRight, Bell } from 'lucide-react';
import { API } from '../services/api';

export default function Dashboard({ user, onNavigate, onStatsChange }) {
  const [stats, setStats] = useState({ xp: 320, streak: 5, coins: 45, level: 1 });
  const [goals, setGoals] = useState([
    { id: 1, text: 'Revise 5 organic formulas in Chemistry', completed: false, xp: 20 },
    { id: 2, text: 'Solve 2 Projectile Motion mock MCQs', completed: true, xp: 15 },
    { id: 3, text: 'Attempt the daily quantitative aptitude test', completed: false, xp: 30 }
  ]);
  const [countdown, setCountdown] = useState({ days: 45, hours: 14, minutes: 22 });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Retrieve stats
    const currentStats = API.stats.getLocalStats();
    setStats(currentStats);
    
    // Fetch notifications
    API.exams.getBookmarks().then(() => {
      setNotifications([
        { id: 1, text: 'Upcoming Test: JEE Main Chemistry Mock starts tomorrow at 10 AM.', type: 'alert' },
        { id: 2, text: 'AI Tip: Focus on Electrostatics integrals this week. Practice now.', type: 'ai' }
      ]);
    });

    // Countdown clock decrement simulation
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1 };
        return { ...prev, minutes: 59, hours: prev.hours > 0 ? prev.hours - 1 : 23 };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleGoal = (id, completed, xpValue) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    
    // Add/Subtract XP locally
    const statsCopy = { ...stats };
    if (!completed) {
      statsCopy.xp += xpValue;
      statsCopy.coins += Math.ceil(xpValue / 5);
      statsCopy.level = Math.floor(statsCopy.xp / 500) + 1;
    } else {
      statsCopy.xp = Math.max(0, statsCopy.xp - xpValue);
      statsCopy.coins = Math.max(0, statsCopy.coins - Math.ceil(xpValue / 5));
      statsCopy.level = Math.floor(statsCopy.xp / 500) + 1;
    }
    setStats(statsCopy);
    localStorage.setItem('examace_user_stats', JSON.stringify(statsCopy));
    if (onStatsChange) onStatsChange(statsCopy);
  };

  const nextLevelXp = stats.level * 500;
  const prevLevelXp = (stats.level - 1) * 500;
  const levelProgress = ((stats.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner with XP and Streak indicators */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-primary-650 to-indigo-650 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl -translate-x-10 translate-y-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-5 w-5 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span className="text-xs uppercase tracking-wider font-semibold text-primary-200">Personalized Prep Hub</span>
            </div>
            <h2 className="text-3xl font-extrabold font-heading tracking-tight">
              Welcome Back, {user?.name || 'Academic Challenger'}!
            </h2>
            <p className="text-sm text-primary-100 mt-1 max-w-xl">
              Your exam count down is ticking. Leverage customized AI tools to solve doubts, generate tests and boost target scores.
            </p>
            <button 
              onClick={() => onNavigate('mockTests')}
              className="mt-4 px-5 py-2.5 bg-white text-primary-600 hover:bg-primary-50 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              Continue Learning
              <Play className="h-4 w-4 fill-primary-600" />
            </button>
          </div>

          {/* Gamified Header widget */}
          <div className="flex flex-wrap items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-orange-500/20 rounded-lg text-orange-400">
                <Flame className="h-5 w-5 fill-orange-400" />
              </div>
              <div>
                <div className="text-xs text-primary-200">Active Streak</div>
                <div className="text-lg font-bold font-heading">{stats.streak} Days</div>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div>
              <div className="flex justify-between items-center text-xs text-primary-200 mb-1">
                <span>Level {stats.level} (XP: {stats.xp})</span>
                <span>{nextLevelXp} XP</span>
              </div>
              <div className="w-36 h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(8, levelProgress))}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 columns - Primary Metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-card border shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Today's Progress</span>
                <h3 className="text-2xl font-bold font-heading text-slate-800 dark:text-white mt-1">75%</h3>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                <div className="bg-primary-500 h-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Overall Accuracy</span>
                <h3 className="text-2xl font-bold font-heading text-emerald-500 mt-1">82.4%</h3>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                <div className="bg-emerald-500 h-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Preferred Exam target</span>
                <h3 className="text-xl font-bold font-heading text-indigo-500 mt-1 truncate">{user?.stats?.preferred_exam || 'JEE Main'}</h3>
              </div>
              <div className="text-xs text-slate-400 mt-3 flex items-center justify-between">
                <span>Target Score: {user?.stats?.target_score || 95}%</span>
                <Award className="h-4 w-4 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Daily study goals list */}
          <div className="p-6 rounded-2xl bg-card border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white">Daily Study Goals</h3>
                <p className="text-xs text-slate-400">Complete items to earn XP and Level Up</p>
              </div>
              <span className="px-2.5 py-1 bg-primary-500/10 text-primary-500 rounded-full text-xs font-semibold">
                {goals.filter(g => g.completed).length} / {goals.length} Completed
              </span>
            </div>
            
            <div className="space-y-3">
              {goals.map((g) => (
                <div 
                  key={g.id}
                  onClick={() => toggleGoal(g.id, g.completed, g.xp)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900 ${
                    g.completed ? 'bg-slate-50/50 dark:bg-slate-900/40 border-emerald-500/30' : 'bg-transparent border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 transition-all ${g.completed ? 'text-emerald-500 fill-emerald-100 dark:fill-transparent' : 'text-slate-300'}`} />
                    <span className={`text-sm ${g.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {g.text}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${g.completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary-500/10 text-primary-500'}`}>
                    +{g.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Studies Recommendation Panel */}
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-primary-500/5 to-indigo-500/5 border border-primary-500/20 shadow-sm relative overflow-hidden">
            <div className="absolute right-4 bottom-2 opacity-5">
              <Sparkles className="h-28 w-28 text-primary-500" />
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-primary-500/10 rounded-xl text-primary-500 mt-1">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-white text-base">AI Custom Recommendation</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  "Based on your recent mini-test errors, you had trouble calculating bond angles under VSEPR theory. We recommend generating a quick 5-question Easy quiz to review the basic concepts."
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button 
                    onClick={() => onNavigate('doubtSolver')}
                    className="text-xs font-semibold px-3.5 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1"
                  >
                    Ask Doubt Solver
                  </button>
                  <button 
                    onClick={() => onNavigate('mockTests')}
                    className="text-xs font-semibold px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-750 transition-all"
                  >
                    Take Topic Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 column - Sidebars and Deadlines */}
        <div className="space-y-6">

          {/* Target Countdown Timer */}
          <div className="p-6 rounded-2xl bg-card border shadow-sm text-center">
            <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Exam Countdown</h3>
            <h4 className="text-lg font-bold font-heading text-slate-700 dark:text-white mt-1">JEE Main Phase 1</h4>
            
            <div className="grid grid-cols-3 gap-2 my-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <div className="text-2xl font-bold font-heading text-primary-500">{countdown.days}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Days</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <div className="text-2xl font-bold font-heading text-primary-500">{countdown.hours}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Hours</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <div className="text-2xl font-bold font-heading text-primary-500">{countdown.minutes}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Mins</div>
              </div>
            </div>
            
            <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
              <Calendar className="h-4 w-4" />
              Target Date: August 16, 2026
            </div>
          </div>

          {/* Recent Notifications hub */}
          <div className="p-6 rounded-2xl bg-card border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold font-heading text-slate-800 dark:text-white">Recent Alerts</h3>
              <Bell className="h-4 w-4 text-slate-400" />
            </div>
            
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs border border-transparent hover:border-slate-100 dark:hover:border-slate-850">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {n.type === 'alert' ? '📅 Schedule Alert' : '🤖 AI Recommendation'}
                  </div>
                  <p className="text-slate-500 leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="p-6 rounded-2xl bg-card border shadow-sm">
            <h3 className="font-bold font-heading text-slate-800 dark:text-white mb-3">Weekly commitment</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Study Hours</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">18.5 hrs</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Quizzes Solved</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">12 tests</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Doubt queries solved</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">8 questions</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
