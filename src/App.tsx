import React, { useState, useEffect } from 'react';
import { BookOpen, Mic, GraduationCap, User, Menu, X } from 'lucide-react';
import { ViewState, Word, Sentence } from './types';
import WordList from './components/learning/WordList';
import QuizView from './components/practice/Quiz'; // Assuming you have this or will generate it
import WrongQuestions from './components/review/WrongQuestions';

// Lazy load data
import a1Data from './data/words/A1_words.json';
import sentenceData from './data/sentences/sentences_all.json';

// --- Navigation Component ---
const Navigation = ({ currentView, setView, isMobileMenuOpen, setIsMobileMenuOpen }: any) => {
  const navItems = [
    { id: 'words', label: '单词学习', icon: BookOpen },
    { id: 'sentences', label: '口语练习', icon: Mic },
    { id: 'quiz', label: '测验挑战', icon: GraduationCap },
    { id: 'profile', label: '错题与进度', icon: User },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block shadow-xl md:shadow-none
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
            <span className="text-2xl">🇫🇷</span> Lumière
          </h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm
                ${currentView === item.id 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon size={20} className={currentView === item.id ? 'stroke-[2.5px]' : 'stroke-2'} />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-6 text-center">
            <p className="text-xs text-slate-300 font-mono">v1.0.0 Alpha</p>
        </div>
      </div>
    </>
  );
};

// --- Sentence View Component (Inline for now) ---
const SentenceView = ({ sentences }: { sentences: Sentence[] }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">口语短句</h2>
            <div className="grid gap-4">
                {sentences.map(sent => (
                    <div key={sent.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xl font-bold text-slate-800">{sent.french}</p>
                        <p className="text-slate-500">{sent.chinese}</p>
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
  
  useEffect(() => {
    // In a real scenario, we might merge multiple JSONs here
    setWords(a1Data as Word[]);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col h-screen overflow-hidden relative">
        <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-slate-800">Lumière French</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 md:pt-8 pt-4 scrollbar-hide">
          <div className="max-w-6xl mx-auto h-full">
            {currentView === 'words' && <WordList words={words} />}
            {currentView === 'sentences' && <SentenceView sentences={sentenceData as Sentence[]} />}
            {currentView === 'quiz' && <QuizView />}
            {currentView === 'profile' && <WrongQuestions />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;