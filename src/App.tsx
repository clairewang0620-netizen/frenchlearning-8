import React, { useState, useEffect } from 'react';
import { BookOpen, Mic, GraduationCap, User, Menu, X, Globe, Sparkles } from 'lucide-react';
import { ViewState, Word, Sentence } from './types';
import WordList from './components/learning/WordList';
import QuizView from './components/practice/Quiz'; 
import WrongQuestions from './components/review/WrongQuestions';

// Data Imports
import a1Part1 from './data/words/A1_part1.json';
import sentencesPart1 from './data/sentences/sentences_part1.json';

// --- Components ---

const Navigation = ({ currentView, setView, isMobileMenuOpen, setIsMobileMenuOpen }: any) => {
  const navItems = [
    { id: 'words', label: '单词词库', icon: BookOpen },
    { id: 'sentences', label: '口语练习', icon: Mic },
    { id: 'quiz', label: '测验挑战', icon: GraduationCap },
    { id: 'profile', label: '我的进度', icon: User },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 transition-transform duration-300 ease-out shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static flex flex-col
      `}>
        {/* Brand */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50 text-white">
              <span className="font-serif text-2xl italic font-bold">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Lumière</h1>
              <p className="text-xs text-slate-400 font-medium">French Learning</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group relative overflow-hidden
                ${currentView === item.id 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={22} className={`transition-transform duration-300 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium text-[15px]">{item.label}</span>
              {currentView === item.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full" />
              )}
            </button>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="p-6 bg-slate-950/30 border-t border-slate-800">
          <div className="flex items-center gap-3 text-slate-400">
             <div className="p-2 bg-slate-800 rounded-lg">
                <Globe size={18} />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-300">每日法语</p>
                <p className="text-[10px] opacity-60">保持学习习惯</p>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SentenceView = ({ sentences }: { sentences: Sentence[] }) => {
    return (
        <div className="space-y-6 pb-20">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-xl shadow-primary-900/10 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/3 -translate-y-1/3">
                    <Mic size={200} />
                </div>
                <h2 className="text-3xl font-bold mb-2 relative z-10">口语短句</h2>
                <p className="text-primary-100 relative z-10 max-w-md">通过情景对话掌握地道表达。点击卡片播放发音，模仿语调。</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {sentences.map(sent => (
                    <div key={sent.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer hover:border-primary-200">
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-[10px] font-bold tracking-wider uppercase text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{sent.category}</span>
                           <span className="text-xs text-slate-400 font-medium">{sent.situation}</span>
                        </div>
                        <p className="text-xl font-bold text-slate-800 mb-2 font-serif group-hover:text-primary-700 transition-colors">{sent.french}</p>
                        <p className="text-sm font-mono text-slate-400 mb-3 bg-slate-50 inline-block px-2 py-1 rounded">{sent.ipa}</p>
                        <p className="text-slate-600 font-medium">{sent.chinese}</p>
                        
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-primary-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                           <Mic size={16} /> 点击播放
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('words');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  
  useEffect(() => {
    setWords(a1Part1 as Word[]);
    setSentences(sentencesPart1 as Sentence[]);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900 overflow-hidden">
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 flex flex-col h-full relative w-full transition-all">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-sm">
               <span className="font-serif font-bold italic">L</span>
            </div>
            <span className="font-bold text-lg text-slate-800">Lumière</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 p-2 active:bg-slate-100 rounded-full">
            <Menu size={24} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-full">
            {currentView === 'words' && <WordList words={words} />}
            {currentView === 'sentences' && <SentenceView sentences={sentences} />}
            {currentView === 'quiz' && <QuizView />}
            {currentView === 'profile' && <WrongQuestions />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;