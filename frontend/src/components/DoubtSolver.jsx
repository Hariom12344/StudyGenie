import React, { useState } from 'react';
import { Send, Upload, Sparkles, HelpCircle, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { API } from '../services/api';

export default function DoubtSolver() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm your ExamAce AI Doubt Solver. You can ask me academic questions, upload handwritten formulas, or paste math equations. I will provide a step-by-step solution, list key formulas, and suggest related topics to review.
      
What can I help you solve today?`,
      concepts: ['Newtonian Mechanics', 'Chemical Kinetics', 'Integration Rules']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [attachedFile, setAttachedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    const userMessage = {
      sender: 'user',
      text: inputText,
      fileName: attachedFile ? attachedFile.name : null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setAttachedFile(null);
    setLoading(true);

    try {
      const res = await API.ai.solveDoubt(
        userMessage.text,
        subject,
        userMessage.fileName ? `/uploads/${userMessage.fileName}` : null
      );

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: res.solution,
        concepts: res.relatedConcepts
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Error generating response. Please check your network connection and API key configurations.',
        concepts: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleConceptClick = (concept) => {
    setInputText(`Can you explain the basic principles and standard formulas of "${concept}"?`);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-fade-in">
      
      {/* Left Chat Window */}
      <div className="flex-1 rounded-2xl bg-card border shadow-sm flex flex-col overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between bg-slate-550/5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-500/10 rounded-lg text-primary-500">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 dark:text-white font-heading text-sm">AI doubt Solver</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Gemini 1.5 Flash Enabled</p>
            </div>
          </div>
          
          {/* Subject Selector */}
          <select 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-1.5 rounded-lg border bg-transparent text-xs font-semibold focus:ring-1 focus:ring-primary-500"
          >
            {['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Quant Aptitude', 'Coding'].map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Chat Message Logs */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`p-2 h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {m.sender === 'user' ? 'U' : 'AI'}
              </div>
              
              <div className="space-y-2">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm border ${
                  m.sender === 'user' 
                    ? 'bg-primary-500 text-white border-primary-400 rounded-tr-none' 
                    : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-850 rounded-tl-none text-slate-700 dark:text-slate-350'
                }`}>
                  {m.text}
                  {m.fileName && (
                    <div className={`mt-2 p-2 rounded-lg border text-xs flex items-center gap-2 ${
                      m.sender === 'user' ? 'bg-black/15 border-white/10 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <FileText className="h-4 w-4" />
                      <span>{m.fileName} (Uploaded)</span>
                    </div>
                  )}
                </div>

                {/* Conceptual click tips (for AI responses) */}
                {m.concepts && m.concepts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.concepts.map((c, cidx) => (
                      <button
                        key={cidx}
                        onClick={() => handleConceptClick(c)}
                        className="text-[10px] font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full border border-primary-500/15 hover:bg-primary-500/20 transition-all"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="p-2 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 flex items-center justify-center text-xs font-bold animate-pulse">
                AI
              </div>
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border rounded-tl-none flex items-center gap-2 text-sm text-slate-400">
                <span className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-primary-500 border-t-transparent"></span>
                Gemini solving calculations & formatting proofs...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t flex items-center gap-3 bg-slate-550/5">
          {/* File Upload Selector */}
          <div className="relative">
            <input 
              type="file" 
              id="file-attachment" 
              className="hidden" 
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />
            <label 
              htmlFor="file-attachment"
              className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all ${
                attachedFile ? 'text-emerald-500 border-emerald-500/35 bg-emerald-500/5' : 'text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Upload className="h-5 w-5" />
            </label>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={attachedFile ? `Attached: ${attachedFile.name}. Press Send.` : "Ask questions, paste math equations, or enter code..."}
              className="w-full pl-4 pr-10 py-3 bg-transparent border rounded-xl outline-none focus:border-primary-500 text-sm transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 p-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all shadow-md"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Right Guide Panel */}
      <div className="w-full md:w-64 space-y-6">
        <div className="p-5 rounded-2xl bg-card border shadow-sm space-y-3 text-xs leading-relaxed text-slate-500">
          <h3 className="font-bold text-slate-800 dark:text-white font-heading text-sm flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-primary-500" />
            Doubt Solver Guide
          </h3>
          <p>
            The doubt solver is integrated with standard math rendering formatting. You can solve complex engineering/medical concepts using:
          </p>
          <div className="space-y-2 pt-1 font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Step-by-step calculus</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Dielectric boundary equations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Organic reaction pathways</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Quantitative puzzles</span>
            </div>
          </div>
        </div>

        {/* Quick Question Prompts */}
        <div className="p-5 rounded-2xl bg-card border shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 dark:text-white font-heading text-xs uppercase tracking-wider">Example Doubts</h3>
          <div className="space-y-2">
            {[
              'Solve electrostatic force on equilateral vertices',
              'Explain mitosis vs meiosis phase durations',
              'Reverse a singly linked list iterative function'
            ].map((ex, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(ex)}
                className="w-full p-2.5 rounded-lg border text-[11px] text-left hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-400 block transition-all hover:border-primary-500/35"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
