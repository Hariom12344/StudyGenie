import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, ChevronLeft, ChevronRight, Bookmark, AlertTriangle, ArrowLeft, RefreshCw, Award } from 'lucide-react';
import { API } from '../services/api';

export default function MockTestRunner({ testId, onBack, onStatsChange }) {
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Test State
  const [answers, setAnswers] = useState({}); // { questionId: selectedValue }
  const [flags, setFlags] = useState({}); // { questionId: boolean }
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [testActive, setTestActive] = useState(true);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTest() {
      try {
        const res = await API.exams.getMockTestQuestions(testId);
        setTest(res.test);
        setQuestions(res.questions);
        setTimeLeft(res.test.duration_minutes * 60);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadTest();
  }, [testId]);

  // Countdown timer effect
  useEffect(() => {
    if (!testActive || timeLeft <= 0) {
      if (timeLeft === 0 && testActive) {
        handleSubmitTest(); // Auto-submit when time is up
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, testActive]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qid, val) => {
    if (!testActive) return;
    setAnswers(prev => ({ ...prev, [qid]: val }));
  };

  const toggleFlag = (qid) => {
    setFlags(prev => ({ ...prev, [qid]: !prev[qid] }));
  };

  const handleSubmitTest = async () => {
    setTestActive(false);
    setSubmitting(true);
    
    // Evaluate scores
    let correct = 0;
    let wrong = 0;
    let totalScore = 0;
    const negMark = test.negative_marking || 0; // standard JEE -1

    questions.forEach(q => {
      const userAns = answers[q.id];
      if (userAns !== undefined && userAns !== '') {
        if (userAns.toString().trim().toUpperCase() === q.correct_answer.toString().trim().toUpperCase()) {
          correct += 1;
          totalScore += 4; // 4 marks per correct answer
        } else {
          wrong += 1;
          totalScore += negMark; // subtract negative mark
        }
      }
    });

    const resultPayload = {
      score: Math.max(0, totalScore),
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
      timeSpentSeconds: (test.duration_minutes * 60) - timeLeft
    };

    try {
      const res = await API.exams.submitMockTest(test.id, resultPayload);
      setResults({
        ...resultPayload,
        rewards: res.rewards
      });
      // Trigger user profile stat updates in parent if callback exists
      if (onStatsChange) {
        const stats = API.stats.getLocalStats();
        onStatsChange(stats);
      }
    } catch (err) {
      console.error(err);
      // Fallback result presentation on failure
      setResults({
        ...resultPayload,
        rewards: { xp: 50, coins: 10, streak: 5, newLevel: 2, levelUp: false, certificate: false }
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="h-10 w-10 text-primary-500 animate-spin" />
        <p className="text-slate-500 text-sm">Loading test parameters...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-8 text-center bg-card border rounded-2xl">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
        <p className="font-bold">Error loading Mock Exam</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm">
          Return to dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  // If test is submitted, show results page
  if (results) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-card border shadow-xl space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="inline-block p-4 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 shadow-md">
            <Award className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-extrabold font-heading text-slate-800 dark:text-white">Mock Test Results</h2>
          <p className="text-sm text-slate-500">{test.title} (Assessment Complete)</p>
        </div>

        {/* Score metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center border">
            <div className="text-sm text-slate-400">Score Achieved</div>
            <div className="text-2xl font-bold text-primary-500 font-heading">{results.score} / {questions.length * 4}</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center border">
            <div className="text-sm text-slate-400">Accuracy</div>
            <div className="text-2xl font-bold text-emerald-500 font-heading">
              {results.totalQuestions > 0 ? Math.round((results.correctAnswers / (results.correctAnswers + results.wrongAnswers || 1)) * 100) : 0}%
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center border">
            <div className="text-sm text-slate-400">Correct answers</div>
            <div className="text-2xl font-bold text-slate-700 dark:text-white font-heading">{results.correctAnswers}</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center border">
            <div className="text-sm text-slate-400">Incorrect answers</div>
            <div className="text-2xl font-bold text-red-500 font-heading">{results.wrongAnswers}</div>
          </div>
        </div>

        {/* Gamified rewards popup */}
        {results.rewards && (
          <div className="p-5 rounded-xl bg-gradient-to-tr from-yellow-500/10 to-amber-500/10 border border-amber-500/20 space-y-3">
            <h4 className="font-bold text-amber-700 dark:text-amber-400 text-sm flex items-center gap-1.5">
              🏆 Gamification Rewards Earned!
            </h4>
            <div className="flex gap-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-600">+{results.rewards.xp} XP</span>
              <span className="bg-amber-500/20 px-3 py-1 rounded-full text-amber-600">+{results.rewards.coins} Coins</span>
              {results.rewards.certificate && (
                <span className="bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-600">🎓 Certificate Issued!</span>
              )}
            </div>
          </div>
        )}

        {/* Explanations Review */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Question Review & Explanations</h3>
          
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const uAns = answers[q.id];
              const isCorrect = uAns !== undefined && uAns.toString().toUpperCase() === q.correct_answer.toString().toUpperCase();
              return (
                <div key={q.id} className="p-4 rounded-xl border space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-500">Question {idx + 1}</span>
                    <span className={`font-semibold px-2 py-0.5 rounded ${isCorrect ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-red-100 dark:bg-red-950 text-red-500'}`}>
                      {isCorrect ? 'Correct' : uAns === undefined ? 'Unanswered' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{q.question_text}</p>
                  
                  {q.type === 'MCQ' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <div>A: {q.option_a}</div>
                      <div>B: {q.option_b}</div>
                      <div>C: {q.option_c}</div>
                      <div>D: {q.option_d}</div>
                    </div>
                  )}

                  <div className="text-xs pt-2 border-t space-y-1">
                    <div><span className="font-bold">Your Response:</span> {uAns || 'None'}</div>
                    <div><span className="font-bold">Correct Solution:</span> {q.correct_answer}</div>
                    <div className="text-slate-500 mt-1 italic"><span className="font-semibold not-italic text-slate-600 dark:text-slate-300">Explanation:</span> {q.solution}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={onBack}
          className="w-full py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-all flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
      
      {/* Left 3 columns: Question screen */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Test Header */}
        <div className="p-4 rounded-xl bg-card border flex items-center justify-between shadow-sm">
          <div>
            <h2 className="font-extrabold text-slate-800 dark:text-white font-heading text-lg leading-tight">{test.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Section: Single Answer Assessment | marking: +4, -1</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg">
            <Timer className="h-4.5 w-4.5 animate-pulse" />
            <span className="font-mono text-sm font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Panel */}
        <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-semibold">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <button 
              onClick={() => toggleFlag(currentQ.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${flags[currentQ.id] ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <Bookmark className={`h-4 w-4 ${flags[currentQ.id] ? 'fill-amber-500' : ''}`} />
              Review Later
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white leading-relaxed">
              {currentQ.question_text}
            </h3>

            {/* MCQ Option render */}
            {currentQ.type === 'MCQ' && (
              <div className="space-y-2.5">
                {[
                  { key: 'A', label: currentQ.option_a },
                  { key: 'B', label: currentQ.option_b },
                  { key: 'C', label: currentQ.option_c },
                  { key: 'D', label: currentQ.option_d }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(currentQ.id, opt.key)}
                    className={`w-full p-4 text-left border rounded-xl text-sm flex items-center justify-between transition-all ${
                      answers[currentQ.id] === opt.key
                        ? 'bg-primary-500/5 border-primary-500 text-primary-600 font-bold dark:text-primary-400'
                        : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-850'
                    }`}
                  >
                    <span>{opt.key}. {opt.label}</span>
                    <span className={`h-5 w-5 rounded-full border flex items-center justify-center text-[10px] ${
                      answers[currentQ.id] === opt.key ? 'bg-primary-500 border-primary-400 text-white' : 'border-slate-300'
                    }`}>
                      {opt.key}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Numerical / Input option */}
            {currentQ.type === 'Numerical' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Your numeric answer:</label>
                <input
                  type="number"
                  placeholder="Type your calculated value"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                  className="w-full max-w-xs px-4 py-2 bg-transparent border rounded-xl outline-none focus:border-primary-500"
                />
              </div>
            )}

            {/* Coding question option */}
            {currentQ.type === 'Coding' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Write code solution:</label>
                <textarea
                  rows={8}
                  placeholder="// Write logic function details here..."
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-850 rounded-xl outline-none font-mono text-xs text-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions footer */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-4 py-2 bg-card border rounded-lg text-sm flex items-center gap-1 disabled:opacity-50"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
            Previous
          </button>
          
          <button
            onClick={handleSubmitTest}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg text-sm shadow-md"
          >
            Submit Assessment
          </button>

          <button
            onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIdx === questions.length - 1}
            className="px-4 py-2 bg-card border rounded-lg text-sm flex items-center gap-1 disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Right Column: Navigator list sidebar */}
      <div className="space-y-6">
        
        {/* Navigation Grid */}
        <div className="p-5 rounded-2xl bg-card border shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-700 dark:text-white font-heading">Question Sheet Navigation</h3>
          
          <div className="grid grid-cols-4 gap-2.5">
            {questions.map((q, idx) => {
              const answered = answers[q.id] !== undefined && answers[q.id] !== '';
              const flagged = flags[q.id];
              const isCurrent = idx === currentIdx;

              let style = 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800';
              if (answered) style = 'bg-primary-500 text-white border-primary-400 shadow-md shadow-primary-500/10';
              if (flagged) style = 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/10';
              if (isCurrent) style = 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-[#070b13] ' + (answered ? 'bg-primary-500 text-white' : flagged ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-750 text-slate-800 dark:text-white');

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-9 w-9 rounded-lg text-xs font-bold border transition-all flex items-center justify-center ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Grid Legend indicators */}
          <div className="pt-3 border-t text-[10px] text-slate-500 space-y-1.5 uppercase font-semibold tracking-wider">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 bg-primary-500 border rounded-sm"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 bg-amber-500 border rounded-sm"></div>
              <span>Flagged for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 bg-slate-50 dark:bg-slate-900 border rounded-sm"></div>
              <span>Not Visited / Empty</span>
            </div>
          </div>
        </div>

        {/* Exit Test notice warning */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 leading-relaxed flex items-start gap-2">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            Do not refresh or exit the browser window. Doing so will invalidate the active assessment sequence and force-submit current responses.
          </div>
        </div>
      </div>
    </div>
  );
}
