import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Mic, GraduationCap, User, Play, RotateCcw, CheckCircle, XCircle, Volume2, Search, Filter, Menu, X, ChevronRight } from 'lucide-react';
import { WORDS, SENTENCES, QUIZZES } from './data/sampleData';
import { Word, Sentence, Quiz, Level, ViewState, UserStats } from './types';
import { speakFrench } from './services/tts';
import { getUserStats, recordQuizResult, removeWeakWord } from './services/storage';

// --- Components ---

// 1. Sidebar Navigation
const Navigation = ({ currentView, setView, isMobileMenuOpen, setIsMobileMenuOpen }: any) => {
  const navItems = [
    { id: 'words', label: '单词学习', icon: BookOpen },
    { id: 'sentences', label: '口语练习', icon: Mic },
    { id: 'quiz', label: '测验挑战', icon: GraduationCap },
    { id: 'profile', label: '错题与进度', icon: User },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="text-2xl">🇫🇷</span> Lumière
          </h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400">
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
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                ${currentView === item.id 
                  ? 'bg-blue-50 text-primary font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

// 2. Flashcard Component
const Flashcard = ({ word, onClose }: { word: Word; onClose: () => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Play audio automatically when card opens
    // speakFrench(word.french); // Optional: Auto-play can be annoying
  }, [word]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            word.level === 'A1' ? 'bg-green-100 text-green-700' :
            word.level === 'A2' ? 'bg-emerald-100 text-emerald-700' :
            word.level === 'B1' ? 'bg-blue-100 text-blue-700' :
            word.level === 'B2' ? 'bg-indigo-100 text-indigo-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {word.level}
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-slate-800">{word.french}</h2>
            <p className="text-slate-400 font-mono text-lg">{word.ipa}</p>
          </div>

          <div className="flex justify-center">
             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  speakFrench(word.french);
                }}
                className="w-16 h-16 rounded-full bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <Volume2 size={32} />
              </button>
          </div>

          <div 
            className={`transition-all duration-300 overflow-hidden ${isFlipped ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{word.part_of_speech}</span>
                <p className="text-2xl font-medium text-slate-800 mt-1">{word.chinese}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-left">
                <p className="text-slate-700 italic mb-1">{word.example}</p>
                <p className="text-slate-500 text-sm">{word.example_chinese}</p>
                <button 
                  onClick={() => speakFrench(word.example)} 
                  className="mt-2 text-primary text-xs flex items-center gap-1 font-medium hover:underline"
                >
                  <Volume2 size={12} /> 播放例句
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            {isFlipped ? "隐藏释义" : "显示释义"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Words View
const WordListView = () => {
  const [selectedLevel, setSelectedLevel] = useState<Level | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const filteredWords = useMemo(() => {
    return WORDS.filter(w => {
      const matchLevel = selectedLevel === 'ALL' || w.level === selectedLevel;
      const matchSearch = w.french.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.chinese.includes(searchTerm);
      return matchLevel && matchSearch;
    });
  }, [selectedLevel, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">单词词库</h2>
          <p className="text-slate-500">共收录 {WORDS.length} 个核心词汇</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索单词或释义..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64"
            />
          </div>
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">所有等级</option>
            <option value="A1">A1 入门</option>
            <option value="A2">A2 基础</option>
            <option value="B1">B1 进阶</option>
            <option value="B2">B2 中级</option>
            <option value="C1">C1 高级</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word) => (
          <div 
            key={word.id}
            onClick={() => setSelectedWord(word)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">{word.french}</h3>
              <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{word.level}</span>
            </div>
            <p className="text-slate-500 text-sm line-clamp-1">{word.chinese}</p>
            <div className="mt-3 flex gap-2">
              {word.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>没有找到相关单词</p>
        </div>
      )}

      {selectedWord && (
        <Flashcard word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}
    </div>
  );
};

// 4. Sentence View
const SentenceView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">口语短句</h2>
        <p className="text-slate-500">点击播放，跟随朗读</p>
      </div>

      <div className="grid gap-4">
        {SENTENCES.map((sent) => (
          <div key={sent.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-0.5 rounded">{sent.category}</span>
                <span className="text-xs text-slate-400">{sent.situation}</span>
              </div>
              <p className="text-lg font-bold text-slate-800">{sent.french}</p>
              <p className="text-sm text-slate-500 font-mono">{sent.ipa}</p>
              <p className="text-slate-600 mt-1">{sent.chinese}</p>
            </div>
            <button 
              onClick={() => speakFrench(sent.french)}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-50 text-slate-600 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
            >
              <Volume2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Quiz View
const QuizView = () => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuiz = QUIZZES[currentQuizIndex];
  const progress = ((currentQuizIndex + 1) / QUIZZES.length) * 100;

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQuiz.correct_answer;
    if (isCorrect) setScore(s => s + 1);

    if (isCorrect) {
      speakFrench("Très bien");
    } else {
      speakFrench("Dommage");
    }
  };

  const handleNext = () => {
    // Record if finished or wrong
    if (currentQuizIndex === QUIZZES.length - 1) {
      // End of quiz batch
      const wrongIds = [];
      if (selectedOption !== currentQuiz.correct_answer) wrongIds.push(currentQuiz.id);
      
      recordQuizResult(
        score + (selectedOption === currentQuiz.correct_answer ? 1 : 0), 
        QUIZZES.length, 
        wrongIds
      );
      setShowResult(true);
    } else {
      setCurrentQuizIndex(p => p + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-4xl mb-4">
          🏆
        </div>
        <h2 className="text-3xl font-bold text-slate-800">测试完成!</h2>
        <p className="text-slate-600 text-lg">
          得分: <span className="font-bold text-primary">{score}</span> / {QUIZZES.length}
        </p>
        <button 
          onClick={resetQuiz}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          <RotateCcw size={20} /> 再测一次
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">等级测试 ({currentQuiz.level})</h2>
        <span className="text-sm font-mono text-slate-500">{currentQuizIndex + 1}/{QUIZZES.length}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{currentQuiz.category}</span>
          <h3 className="text-xl font-bold text-slate-900 mt-2">{currentQuiz.question}</h3>
          <button 
             onClick={() => speakFrench(currentQuiz.question)}
             className="mt-2 text-primary hover:text-blue-600 flex items-center gap-1 text-sm font-medium"
          >
            <Volume2 size={16} /> 朗读问题
          </button>
        </div>

        <div className="space-y-3">
          {currentQuiz.options.map((option) => {
            let stateClass = "border-slate-200 hover:border-blue-300 hover:bg-blue-50";
            if (selectedOption === option.id) {
              stateClass = "border-primary bg-blue-50 ring-1 ring-primary";
            }
            if (isSubmitted) {
              if (option.id === currentQuiz.correct_answer) {
                stateClass = "border-green-500 bg-green-50 text-green-700";
              } else if (option.id === selectedOption) {
                stateClass = "border-red-500 bg-red-50 text-red-700";
              } else {
                stateClass = "border-slate-100 opacity-50";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={isSubmitted}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${stateClass}`}
              >
                <span>{option.text}</span>
                {isSubmitted && option.id === currentQuiz.correct_answer && <CheckCircle size={20} className="text-green-500" />}
                {isSubmitted && option.id === selectedOption && option.id !== currentQuiz.correct_answer && <XCircle size={20} className="text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Actions */}
      {isSubmitted && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl animate-in slide-in-from-bottom-2">
          <p className="font-bold text-blue-800 mb-1">解析：</p>
          <p className="text-blue-700 text-sm">{currentQuiz.explanation}</p>
        </div>
      )}

      <div className="pt-4">
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full bg-primary disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-[0.98]"
          >
            提交答案
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold shadow-lg transition-all hover:bg-slate-700 active:scale-[0.98] flex justify-center items-center gap-2"
          >
            下一题 <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

// 6. Profile / Stats View
const ProfileView = () => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getUserStats());
  }, []);

  if (!stats) return <div>Loading...</div>;

  const accuracy = stats.totalQuestionsAttempted > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestionsAttempted) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">学习档案</h2>
        <p className="text-slate-500">坚持就是胜利</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase">总练习题数</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalQuestionsAttempted}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase">正确率</p>
          <p className={`text-3xl font-bold mt-1 ${accuracy >= 80 ? 'text-green-500' : accuracy >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
            {accuracy}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase">待复习错题</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">{stats.weakWords.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase">练习天数</p>
          <p className="text-3xl font-bold text-blue-500 mt-1">{new Set(stats.quizHistory.map(h => h.date)).size}</p>
        </div>
      </div>

      {/* Weak Areas List (Mistake Notebook) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">错题本 / 薄弱点</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {stats.weakWords.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <CheckCircle size={48} className="mx-auto mb-3 text-green-200" />
              <p>太棒了！目前没有错题需要复习。</p>
            </div>
          ) : (
            stats.weakWords.map(id => {
              // Try to find the data related to the ID (Mock logic)
              const quiz = QUIZZES.find(q => q.id === id);
              // In a real app, we might store word IDs too, but here we just demo Quiz IDs
              if (!quiz) return null;

              return (
                <div key={id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                  <div>
                    <span className="text-xs text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded">{quiz.category}</span>
                    <p className="font-medium text-slate-800 mt-1">{quiz.question}</p>
                    <p className="text-sm text-slate-500">正确答案: {quiz.options.find(o => o.id === quiz.correct_answer)?.text}</p>
                  </div>
                  <button 
                    onClick={() => {
                      removeWeakWord(id);
                      setStats(getUserStats());
                    }}
                    className="p-2 text-slate-400 hover:text-green-500 transition-colors"
                    title="标记为已掌握"
                  >
                    <CheckCircle size={20} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Layout ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('words');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-slate-200">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-lg text-slate-800">Lumière French</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentView === 'words' && <WordListView />}
          {currentView === 'sentences' && <SentenceView />}
          {currentView === 'quiz' && <QuizView />}
          {currentView === 'profile' && <ProfileView />}
        </div>
      </main>
    </div>
  );
};

export default App;