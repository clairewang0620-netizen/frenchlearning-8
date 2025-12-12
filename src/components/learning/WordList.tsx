import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, Volume2, Sparkles } from 'lucide-react';
import { Word, Level } from '../../types';
import Flashcard from './Flashcard';
import { ttsManager } from '../../utils/TTSManager';

interface WordListProps {
  words: Word[];
}

const ITEMS_PER_PAGE = 32;

const WordList: React.FC<WordListProps> = ({ words }) => {
  const [selectedLevel, setSelectedLevel] = useState<Level | 'ALL'>('A1');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredWords = useMemo(() => {
    return words.filter(w => {
      const matchLevel = selectedLevel === 'ALL' || w.level === selectedLevel;
      const matchSearch = w.french.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.chinese.includes(searchTerm) ||
                          w.category.includes(searchTerm);
      return matchLevel && matchSearch;
    });
  }, [selectedLevel, searchTerm, words]);

  const visibleWords = filteredWords.slice(0, visibleCount);

  const handlePlayAudio = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    ttsManager.speakText(text);
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="sticky top-0 z-20 -mx-4 px-4 md:-mx-8 md:px-8 py-4 bg-gray-50/90 backdrop-blur-xl border-b border-white/50 transition-all">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">单词词库</h2>
              <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                <Sparkles size={14} className="text-primary-500" />
                收录 {filteredWords.length} 个核心词汇
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="搜索单词、意思..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-full sm:w-64 transition-all text-sm font-medium"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value as any);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none w-full sm:w-auto cursor-pointer font-bold text-sm text-slate-700 hover:border-slate-300 transition-colors"
                >
                  <option value="ALL">全部等级</option>
                  <option value="A1">A1 入门</option>
                  <option value="A2">A2 基础</option>
                  <option value="B1">B1 进阶</option>
                  <option value="B2">B2 中级</option>
                  <option value="C1">C1 高级</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="min-h-[50vh]">
        {visibleWords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
            {visibleWords.map((word) => (
              <div 
                key={word.id}
                onClick={() => setSelectedWord(word)}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-primary-200 transition-all duration-300 cursor-pointer group relative flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-extrabold tracking-wide px-2 py-1 rounded-md ${
                     word.level === 'A1' ? 'bg-green-50 text-green-600' :
                     word.level === 'A2' ? 'bg-emerald-50 text-emerald-600' :
                     word.level === 'B1' ? 'bg-blue-50 text-blue-600' :
                     word.level === 'B2' ? 'bg-indigo-50 text-indigo-600' :
                     'bg-purple-50 text-purple-600'
                  }`}>{word.level}</span>
                  
                  <button 
                    onClick={(e) => handlePlayAudio(e, word.french)}
                    className="text-slate-300 hover:text-primary-500 hover:bg-primary-50 p-1.5 rounded-full transition-colors"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 font-serif mb-1 group-hover:text-primary-700 transition-colors">{word.french}</h3>
                <p className="text-slate-500 text-sm font-medium line-clamp-1 mb-4">{word.chinese}</p>
                
                <div className="mt-auto flex flex-wrap gap-2 pt-3 border-t border-slate-50">
                  <span className="text-[10px] bg-gray-100 text-slate-500 px-2 py-1 rounded-full font-medium">{word.category}</span>
                  {word.tags.slice(0, 1).map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-50 text-slate-400 px-2 py-1 rounded-full border border-gray-100">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <Search size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">没有找到匹配的单词</p>
            <button onClick={() => {setSearchTerm(''); setSelectedLevel('ALL')}} className="mt-2 text-primary-600 text-sm font-bold hover:underline">清除筛选条件</button>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredWords.length && (
          <div className="flex justify-center pb-10">
            <button 
              onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
              className="group bg-white border border-slate-200 text-slate-600 px-8 py-3 rounded-full hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 shadow-sm transition-all font-bold text-sm flex items-center gap-2"
            >
              加载更多 
              <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                {filteredWords.length - visibleCount}
              </span>
            </button>
          </div>
        )}
      </div>

      {selectedWord && (
        <Flashcard word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}
    </div>
  );
};

export default WordList;