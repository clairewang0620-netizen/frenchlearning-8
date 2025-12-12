import React, { useState } from 'react';
import { RotateCcw, CheckCircle, XCircle, Volume2, ChevronRight, Trophy, ArrowRight } from 'lucide-react';
import { Quiz } from '../../types';
import { ttsManager } from '../../utils/TTSManager';
import { recordQuizResult } from '../../services/storage';

// Mock Quiz Data (Since real data loading depends on structure, we use sample for now or load if passed)
// In a real app, this would be passed as props or loaded from a store.
import { QUIZZES } from '../../data/sampleData';

const QuizView: React.FC = () => {
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
    if (isCorrect) {
        setScore(s => s + 1);
        ttsManager.speakText("Très bien");
    } else {
        ttsManager.speakText("Dommage");
    }
  };

  const handleNext = () => {
    if (currentQuizIndex === QUIZZES.length - 1) {
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="relative">
            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center text-6xl shadow-inner mb-4 relative z-10">
            🏆
            </div>
            <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-800">测试完成!</h2>
            <p className="text-slate-500 font-medium">本次挑战成绩</p>
        </div>

        <div className="flex items-end gap-2 text-6xl font-black text-primary-600">
            {score} <span className="text-2xl text-slate-400 font-bold mb-2">/ {QUIZZES.length}</span>
        </div>

        <button 
          onClick={resetQuiz}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl hover:bg-slate-800 hover:scale-105 transition-all"
        >
          <RotateCcw size={20} /> 再测一次
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">等级测试 ({currentQuiz.level})</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Challenge your vocabulary</p>
        </div>
        <span className="text-xl font-mono font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
            {currentQuizIndex + 1}<span className="text-slate-400 text-sm">/{QUIZZES.length}</span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-primary-500 to-purple-500"></div>
        
        <div className="mb-8">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">{currentQuiz.category}</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-4 leading-relaxed">{currentQuiz.question}</h3>
          <button 
             onClick={() => ttsManager.speakText(currentQuiz.question)}
             className="mt-3 text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold w-fit transition-colors"
          >
            <Volume2 size={18} /> 朗读问题
          </button>
        </div>

        <div className="grid gap-3">
          {currentQuiz.options.map((option) => {
            let stateClass = "border-slate-200 hover:border-primary-300 hover:bg-slate-50";
            let icon = null;

            if (selectedOption === option.id) {
              stateClass = "border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-offset-2";
            }
            if (isSubmitted) {
              if (option.id === currentQuiz.correct_answer) {
                stateClass = "border-green-500 bg-green-50 text-green-800 ring-2 ring-green-500";
                icon = <CheckCircle size={24} className="text-green-600" />;
              } else if (option.id === selectedOption) {
                stateClass = "border-red-500 bg-red-50 text-red-800";
                icon = <XCircle size={24} className="text-red-500" />;
              } else {
                stateClass = "border-slate-100 opacity-50 bg-slate-50";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={isSubmitted}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200 flex justify-between items-center group font-medium text-lg ${stateClass}`}
              >
                <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border ${isSubmitted && option.id === currentQuiz.correct_answer ? 'bg-green-200 border-green-300 text-green-800' : 'bg-white border-slate-200 text-slate-500'}`}>
                        {option.id}
                    </span>
                    <span>{option.text}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Actions */}
      {isSubmitted && (
        <div className="bg-blue-50/80 backdrop-blur border border-blue-100 p-6 rounded-2xl animate-in slide-in-from-bottom-4 shadow-sm">
          <p className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span className="text-xl">💡</span> 解析
          </p>
          <p className="text-blue-800 leading-relaxed">{currentQuiz.explanation}</p>
        </div>
      )}

      <div className="pt-4 flex justify-end">
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full md:w-auto bg-primary-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-700 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            提交答案 <ArrowRight size={20} />
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 flex justify-center items-center gap-2"
          >
            下一题 <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;