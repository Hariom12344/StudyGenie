import React, { useState, useEffect } from 'react';
import { BookOpen, Layers, Award, Clock, ArrowRight, Compass, ShieldAlert, Sparkles } from 'lucide-react';
import { API } from '../services/api';

export default function ExamsBrowser({ onStartTest }) {
  const [exams, setExams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Engineering Entrance');
  const [selectedExamId, setSelectedExamId] = useState(3); // Default to JEE Main (id: 3)
  const [subjects, setSubjects] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'School', 
    'Engineering Entrance', 
    'Medical Entrance', 
    'Government Exams', 
    'Placement Preparation'
  ];

  useEffect(() => {
    async function loadExams() {
      try {
        const res = await API.exams.getExams();
        setExams(res.exams);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadExams();
  }, []);

  // Update selected subjects and tests when exam changes
  useEffect(() => {
    if (!selectedExamId) return;

    async function loadExamDetails() {
      try {
        const subRes = await API.exams.getSubjects(selectedExamId);
        setSubjects(subRes.subjects);

        const testRes = await API.exams.getMockTests(selectedExamId);
        setMockTests(testRes.mockTests);
      } catch (err) {
        console.error(err);
      }
    }
    loadExamDetails();
  }, [selectedExamId]);

  const filteredExams = exams.filter(e => e.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
      
      {/* Sidebar: Categories & Exam listings */}
      <div className="md:col-span-1 space-y-4">
        
        {/* Categories selector */}
        <div className="p-4 rounded-2xl bg-card border shadow-sm space-y-2">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Categories</h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  const firstExam = exams.find(e => e.category === cat);
                  if (firstExam) setSelectedExamId(firstExam.id);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exams inside selected category */}
        <div className="p-4 rounded-2xl bg-card border shadow-sm space-y-2">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Exam Directories</h3>
          <div className="space-y-1">
            {filteredExams.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setSelectedExamId(ex.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedExamId === ex.id
                    ? 'bg-primary-500/10 border-primary-500 text-primary-500 dark:text-primary-400 font-bold'
                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {ex.name}
              </button>
            ))}
            
            {filteredExams.length === 0 && !loading && (
              <div className="text-[10px] text-slate-400 text-center py-4">No exams indexed yet.</div>
            )}
          </div>
        </div>

      </div>

      {/* Main Content Pane: Subjects and Quizzes */}
      <div className="md:col-span-3 space-y-6">
        
        {/* Exam Title header */}
        {selectedExamId && (
          <div className="p-5 rounded-2xl bg-card border shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-800 dark:text-white">
                {exams.find(e => e.id === selectedExamId)?.name || 'Select an Exam'} Syllabus
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {exams.find(e => e.id === selectedExamId)?.description || 'Please select an exam target.'}
              </p>
            </div>
            
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 shrink-0">
              <Compass className="h-5 w-5" />
            </div>
          </div>
        )}

        {/* Subjects list grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <div key={sub.id} className="p-4 rounded-xl border bg-card shadow-sm space-y-1 hover-lift">
              <span className="text-[9px] uppercase font-bold text-primary-500">{sub.name}</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{sub.name} Prep</h4>
              <p className="text-xs text-slate-400 leading-tight line-clamp-2">{sub.desc || 'Core subject syllabus definitions.'}</p>
            </div>
          ))}
        </div>

        {/* Mock Quizzes Panel */}
        <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white font-heading text-sm">Available Timed Assessments</h3>
          
          <div className="space-y-3">
            {mockTests.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30 hover:border-primary-500/35 transition-all">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-0.5"><Clock className="h-3.5 w-3.5" /> {t.duration_minutes} Mins</span>
                    <span>• Marks: {t.total_marks}</span>
                    <span>• Category: {t.exam_name}</span>
                  </div>
                </div>

                <button
                  onClick={() => onStartTest(t.id)}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-md"
                >
                  Start Timed Test
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {mockTests.length === 0 && (
              <div className="p-8 text-center text-xs border border-dashed rounded-xl text-slate-400">
                No mock assessments published for this selection. Try checking 'Placement Preparation' or 'Engineering Entrance'.
              </div>
            )}
          </div>
        </div>

        {/* AI generator hint */}
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-primary-500/5 to-indigo-500/5 border border-primary-500/20 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary-500/10 rounded-xl text-primary-500 shrink-0">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">Need a customized practice sheet?</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Let our AI generate a mock test calibrated to your current speed limits.</p>
            </div>
          </div>
          <button 
            onClick={() => onStartTest('ai-gen')}
            className="text-xs font-bold text-primary-500 hover:underline shrink-0"
          >
            Generate Quiz
          </button>
        </div>

      </div>
    </div>
  );
}
