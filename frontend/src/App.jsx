import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, HelpCircle, Trophy, BarChart2, User, LogOut, 
  Moon, Sun, Bell, Search, BookMarked, Award, Shield, Menu, X, Sparkles, CheckCircle2, Flame
} from 'lucide-react';
import { API } from './services/api';
import AuthPages from './components/AuthPages';
import Dashboard from './components/Dashboard';
import ExamsBrowser from './components/ExamsBrowser';
import MockTestRunner from './components/MockTestRunner';
import DoubtSolver from './components/DoubtSolver';
import StudyPlanner from './components/StudyPlanner';
import Analytics from './components/Analytics';
import MaterialCards from './components/MaterialCards';
import Panels from './components/Panels';

export default function App() {
  // Theme & Session
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeTestId, setActiveTestId] = useState(null);
  const [userStats, setUserStats] = useState({ xp: 320, streak: 5, coins: 45, level: 1 });
  
  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile Layout
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Sync session
    const token = localStorage.getItem('examace_token');
    const storedUser = localStorage.getItem('examace_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      const stats = API.stats.getLocalStats();
      setUserStats(stats);
    }
    
    // Load default notifications
    setNotifications([
      { id: 1, message: 'Welcome to ExamAce! Let AI configure your study plans.', is_read: false },
      { id: 2, message: 'New JEE Main Physics PYQ Paper 2024 has been uploaded.', is_read: false }
    ]);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    const html = document.documentElement;
    if (nextTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    const stats = API.stats.getLocalStats();
    setUserStats(stats);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    API.auth.logout();
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleStartTest = (testId) => {
    if (testId === 'ai-gen') {
      // Simulate AI Question Generator mock test
      setActiveTestId(1);
    } else {
      setActiveTestId(testId);
    }
    setActiveTab('testRunner');
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Route to appropriate view based on query keywords
    const query = searchQuery.toLowerCase();
    if (query.includes('mock') || query.includes('quiz') || query.includes('test')) {
      setActiveTab('mockTests');
    } else if (query.includes('doubt') || query.includes('solve')) {
      setActiveTab('doubtSolver');
    } else if (query.includes('schedule') || query.includes('plan')) {
      setActiveTab('planner');
    } else if (query.includes('paper') || query.includes('pyq') || query.includes('notes') || query.includes('flashcard')) {
      setActiveTab('materials');
    } else {
      alert(`Global search results for: "${searchQuery}" (simulated complete)`);
    }
    setSearchQuery('');
  };

  // If user session is empty, redirect to login
  if (!user) {
    return <AuthPages onLoginSuccess={handleLoginSuccess} />;
  }

  // Sidebar Menu mapping
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { key: 'mockTests', label: 'Exams & Quizzes', icon: BookMarked },
    { key: 'doubtSolver', label: 'AI Doubt Solver', icon: HelpCircle },
    { key: 'planner', label: 'AI Study Planner', icon: Calendar },
    { key: 'materials', label: 'PYQs & Materials', icon: Trophy },
    { key: 'analytics', label: 'Analytics & Leaderboard', icon: BarChart2 }
  ];

  // If Teacher or Admin, append panel links
  if (user.role === 'Teacher' || user.role === 'Admin') {
    menuItems.push({ key: 'panels', label: `${user.role} Control Panel`, icon: Shield });
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 bg-[#f8fafc] text-[#0f172a] dark:bg-[#070b13] dark:text-[#f8fafc]`}>
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/70 dark:bg-[#0a0f1e]/80 backdrop-blur-md flex items-center justify-between px-6 py-3.5 select-none print:hidden">
        
        {/* Logo and Mobile Menu toggle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2 bg-primary-500/10 rounded-xl text-primary-500 shadow-sm border border-primary-500/20">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <span className="font-heading font-extrabold text-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-primary-200 bg-clip-text text-transparent">
              ExamAce
            </span>
          </div>
        </div>

        {/* Center: Global Search (Module 22) */}
        <form onSubmit={handleGlobalSearch} className="hidden md:flex items-center relative w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, topics, PYQs, flashcards, planner..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-900/60 border dark:border-white/5 rounded-xl outline-none focus:border-primary-500 transition-all"
          />
        </form>

        {/* Right Action panel */}
        <div className="flex items-center gap-4">
          
          {/* Streak badge */}
          {user.role === 'Student' && (
            <div className="hidden sm:flex items-center gap-1 bg-orange-500/10 text-orange-500 border border-orange-500/25 px-2.5 py-1 rounded-lg text-xs font-bold">
              <Flame className="h-4 w-4 fill-orange-500" />
              <span>{userStats.streak} Days</span>
            </div>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl border bg-card text-slate-400 hover:text-primary-500 transition-all"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Notification hub dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl border bg-card text-slate-400 hover:text-primary-500 transition-all relative"
            >
              <Bell className="h-4.5 w-4.5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#070b13]"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2.5 w-80 bg-card border rounded-2xl shadow-xl p-4 space-y-3 z-50 animate-slide-up">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-bold text-xs">Notifications Hub</h4>
                  <button onClick={() => setNotifications([])} className="text-[10px] text-primary-500 font-semibold hover:underline">Clear all</button>
                </div>
                <div className="space-y-2">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs">
                      {n.message}
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center text-[10px] text-slate-400 py-4">No new alerts.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile details */}
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-500">
              {user.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-700 dark:text-white leading-tight">{user.name}</div>
              <div className="text-[9px] text-slate-400 capitalize">{user.role} Account</div>
            </div>
            
            {/* Logout button */}
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-all ml-1"
              title="Sign Out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Layout Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar navigation */}
        <aside className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 z-30 w-64 border-r bg-white dark:bg-[#090f1b] transition-transform duration-300 flex flex-col justify-between p-4 print:hidden`}>
          
          <div className="space-y-6">
            
            {/* Nav Menu items */}
            <nav className="space-y-1 pt-4 md:pt-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key || (item.key === 'mockTests' && activeTab === 'testRunner');
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/10'
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer details */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border text-center">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Platform Status</div>
            <div className="text-xs font-bold text-emerald-500 mt-1 flex items-center justify-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              {API.isMock() ? 'Client Offline Simulation' : 'Live Sync Database'}
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto relative bg-[#f8fafc] dark:bg-[#070b13]">
          {activeTab === 'dashboard' && (
            <Dashboard 
              user={user} 
              onNavigate={setActiveTab} 
              onStatsChange={setUserStats} 
            />
          )}
          
          {activeTab === 'mockTests' && (
            <ExamsBrowser onStartTest={handleStartTest} />
          )}

          {activeTab === 'testRunner' && (
            <MockTestRunner 
              testId={activeTestId} 
              onBack={() => setActiveTab('mockTests')} 
              onStatsChange={setUserStats} 
            />
          )}

          {activeTab === 'doubtSolver' && <DoubtSolver />}

          {activeTab === 'planner' && <StudyPlanner />}

          {activeTab === 'materials' && <MaterialCards />}

          {activeTab === 'panels' && <Panels role={user.role} />}
        </main>

      </div>
    </div>
  );
}
