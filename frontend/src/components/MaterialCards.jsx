import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Bookmark, Award, FileText, Download, Play, Plus, RefreshCw, Save, CheckCircle2 } from 'lucide-react';
import { API } from '../services/api';

export default function MaterialCards({ activeSubTab }) {
  const [currentTab, setCurrentTab] = useState(activeSubTab || 'flashcards');
  const [search, setSearch] = useState('');
  
  // Flashcard States
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newSubject, setNewSubject] = useState('Physics');
  const [showAddCard, setShowAddCard] = useState(false);

  // PYQ States
  const [papers, setPapers] = useState([]);
  const [examFilter, setExamFilter] = useState('All');

  // Bookmark States
  const [bookmarks, setBookmarks] = useState([]);

  // Certificate States
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cardsRes = await API.exams.getFlashcards();
      setFlashcards(cardsRes.flashcards);

      const pyqRes = await API.exams.getPYQs();
      setPapers(pyqRes.papers);

      const bRes = await API.exams.getBookmarks();
      setBookmarks(bRes.bookmarks);

      const certRes = await API.stats.getCertificates();
      setCertificates(certRes.certificates);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFlashcard = async (e) => {
    e.preventDefault();
    if (!newFront || !newBack) return;
    try {
      await API.exams.createFlashcard({ subject: newSubject, front: newFront, back: newBack });
      setNewFront('');
      setNewBack('');
      setShowAddCard(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFlip = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Subtab Selector */}
      <div className="flex gap-2 border-b pb-1 overflow-x-auto print:hidden">
        {[
          { key: 'flashcards', label: '🎴 Study Flashcards' },
          { key: 'pyqs', label: '📄 Previous Year Papers' },
          { key: 'bookmarks', label: '🔖 Saved Bookmarks' },
          { key: 'certificates', label: '🎓 Certificates' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key)}
            className={`px-4 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
              currentTab === tab.key 
                ? 'border-primary-500 text-primary-500' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FLASHCARDS TAB */}
      {currentTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white font-heading text-lg">Spaced Repetition Flashcards</h3>
              <p className="text-xs text-slate-400">Click cards to reveal solutions. Active recall aids retention.</p>
            </div>
            <button
              onClick={() => setShowAddCard(!showAddCard)}
              className="px-3.5 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add Flashcard
            </button>
          </div>

          {/* Add card overlay */}
          {showAddCard && (
            <form onSubmit={handleAddFlashcard} className="p-5 rounded-2xl bg-card border shadow-sm space-y-4 max-w-md animate-slide-up">
              <h4 className="font-bold text-sm">Create New Memory Card</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Subject</label>
                  <select 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg text-xs bg-transparent"
                  >
                    {['Physics', 'Chemistry', 'Mathematics', 'Biology', 'General Science'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Front (Concept/Question)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. What is the value of K in Coulombs law?"
                    value={newFront}
                    onChange={(e) => setNewFront(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg text-xs bg-transparent outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Back (Answer/Solution)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. 9 * 10^9 N m^2/C^2"
                    value={newBack}
                    onChange={(e) => setNewBack(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg text-xs bg-transparent outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end text-xs">
                <button type="button" onClick={() => setShowAddCard(false)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                <button type="submit" className="px-3.5 py-1.5 bg-primary-500 text-white rounded-lg font-semibold flex items-center gap-1"><Save className="h-4 w-4" /> Save Card</button>
              </div>
            </form>
          )}

          {/* Flashcard grid list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {flashcards.map(card => {
              const isFlipped = flipped[card.id];
              return (
                <div
                  key={card.id}
                  onClick={() => toggleFlip(card.id)}
                  className="h-48 border rounded-2xl cursor-pointer relative shadow-sm hover-lift bg-card border-slate-100 dark:border-slate-850"
                  style={{ perspective: '1000px' }}
                >
                  <div 
                    className="absolute inset-0 w-full h-full duration-500 rounded-2xl flex flex-col justify-between p-5"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transition: 'transform 0.6s'
                    }}
                  >
                    {/* Front Face Content */}
                    <div className="backface-hidden w-full h-full flex flex-col justify-between" style={{ backfaceVisibility: 'hidden' }}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold uppercase bg-primary-500/10 text-primary-500 px-2 py-0.5 rounded">
                          {card.subject}
                        </span>
                        <span className="text-[10px] text-slate-400">Front (Recall)</span>
                      </div>
                      <p className="text-sm font-bold text-center text-slate-700 dark:text-slate-200 py-4 leading-relaxed">
                        {card.front}
                      </p>
                      <div className="text-[10px] text-slate-400 text-center uppercase tracking-wider font-semibold">
                        Click card to flip
                      </div>
                    </div>

                    {/* Back Face Content */}
                    <div 
                      className="absolute inset-0 w-full h-full flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-tr from-primary-650 to-indigo-650 text-white"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="flex justify-between items-center text-[10px] text-primary-200">
                        <span>Answer Details</span>
                        <span>Back Face</span>
                      </div>
                      <p className="text-sm font-bold text-center py-4 leading-relaxed">
                        {card.back}
                      </p>
                      <div className="text-[10px] text-primary-200 text-center uppercase tracking-wider font-semibold">
                        Click to flip back
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PYQS TAB */}
      {currentTab === 'pyqs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white font-heading text-lg">Previous Year Papers</h3>
              <p className="text-xs text-slate-400 font-medium">Download PDFs and search papers by exam category or year.</p>
            </div>
            
            {/* Search inputs and Filters */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border bg-transparent text-xs font-semibold"
              >
                <option value="All">All Exams</option>
                {['JEE Main', 'NEET UG', 'Class 12 Boards', 'Placement Prep'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-4 py-1.5 bg-transparent border rounded-lg text-xs outline-none focus:border-primary-500 w-44"
                />
              </div>
            </div>
          </div>

          {/* Papers grid logs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {papers
              .filter(p => (examFilter === 'All' || p.exam_name === examFilter) && p.title.toLowerCase().includes(search.toLowerCase()))
              .map(p => (
                <div key={p.id} className="p-4 rounded-xl border bg-card shadow-sm flex items-center justify-between hover-lift">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-lg shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">{p.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                        {p.exam_name} • Year: {p.year}
                      </p>
                    </div>
                  </div>
                  
                  <a
                    href={p.file_url}
                    download
                    className="p-2 border rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-500/5 transition-all flex items-center justify-center"
                    title="Download PDF"
                    onClick={(e) => { e.preventDefault(); alert('Simulated PDF Download complete!'); }}
                  >
                    <Download className="h-4.5 w-4.5" />
                  </a>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* BOOKMARKS TAB */}
      {currentTab === 'bookmarks' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white font-heading text-lg">Your Saved Bookmarks</h3>
            <p className="text-xs text-slate-400">Notes, PYQs, and videos saved for future review.</p>
          </div>

          <div className="space-y-2 max-w-xl">
            {bookmarks.map(b => (
              <div key={b.id} className="p-3.5 rounded-xl border bg-card shadow-sm flex items-center justify-between hover:border-primary-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <Bookmark className="h-4.5 w-4.5 text-primary-500 fill-primary-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">{b.title}</h4>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-semibold uppercase mt-1 inline-block">
                      {b.item_type}
                    </span>
                  </div>
                </div>
                
                <button className="text-xs font-bold text-primary-500 hover:underline flex items-center gap-0.5">
                  Open
                  <Play className="h-3.5 w-3.5 fill-primary-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATES TAB */}
      {currentTab === 'certificates' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white font-heading text-lg">Academic Certificates</h3>
            <p className="text-xs text-slate-400">Earn credentials by achieving 80%+ marks on Mock Tests.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map(c => (
              <div key={c.id} className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 border border-indigo-500/25 text-white shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-[0.03]">
                  <Award className="h-44 w-44" />
                </div>
                
                <div>
                  <div className="flex justify-between items-start">
                    <Award className="h-8 w-8 text-yellow-400 fill-yellow-400/20" />
                    <span className="text-[10px] text-indigo-300 font-mono">Issued: {c.issued_at}</span>
                  </div>
                  <h4 className="text-base font-extrabold font-heading mt-3">{c.title}</h4>
                  <p className="text-xs text-indigo-200 mt-1">{c.milestone_name}</p>
                </div>
                
                <button
                  onClick={() => alert('Certificate PDF generated successfully!')}
                  className="w-fit px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Certificate PDF
                </button>
              </div>
            ))}

            {certificates.length === 0 && (
              <div className="p-8 text-center bg-card border border-dashed rounded-2xl sm:col-span-2 text-slate-400 text-xs">
                No certificates earned yet. Achieve 80%+ on any mock test to generate certificates.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
