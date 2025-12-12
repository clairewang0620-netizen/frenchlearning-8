import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, BookOpen } from 'lucide-react';
import { Word, Level } from '../../types';
import Flashcard from './Flashcard';

interface WordListProps {
  words: Word[]; // Full dataset passed in
}

const ITEMS_PER_PAGE = 24;

const WordList: React.FC<WordListProps> = ({ words }) => {
  const [selectedLevel, setSelectedLevel] = useState<Level | 'ALL'>('A1'); // Default to A1 to show data immediately
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filter Logic
  const filteredWords = useMemo(() => {
    return words.filter(w => {
      const matchLevel = selectedLevel === 'ALL' || w.level === selectedLevel;
      const matchSearch = w.french.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.chinese.includes(searchTerm) ||
                          w.category.includes(searchTerm);
      return matchLevel && matchSearch;
    });
  }, [selectedLevel, searchTerm, words]);

  // Visible subset for performance
  const visibleWords = filteredWords.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const handleLevelChange = (level: Level | 'ALL') => {
    setSelectedLevel(level);
    setVisibleCount(ITEMS_PER_PAGE); // Reset pagination
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 bg-slate-50 pt-2 pb-4 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-primary" /> 单词词库
          </h2>
          <p className="text-slate-500 text-sm">已加载 {filteredWords.length} 个单词</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="搜索单词、意思或类别..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={selectedLevel}
              onChange={(e) => handleLevelChange(e.target.value as any)}
              className="pl-10 pr-8 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none w-full sm:w-auto cursor-pointer font-medium text-slate-700"
            >
              <option value="ALL">全部等级</option>
              <option value="A1">A1 入门</option>
              <option value="A2">A2 基础</option>
              <option value="B1">B1 进阶</option>
              <option value="B2">B2 中级</option>
              <option value="C1">C1 高级</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1">
        {visibleWords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
            {visibleWords.map((word) => (
              <div 
                key={word.id}
                onClick={() => setSelectedWord(word)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group active:scale-[0.99] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                   <div className={`w-2 h-2 rounded-full ${word.audio_mp3 ? 'bg-green-500' : 'bg-slate-300'}`} />
                </div>
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">{word.french}</h3>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                     word.level === 'A1' ? 'bg-green-50 text-green-600' :
                     word.level === 'A2' ? 'bg-emerald-50 text-emerald-600' :
                     word.level === 'B1' ? 'bg-blue-50 text-blue-600' :
                     'bg-purple-50 text-purple-600'
                  }`}>{word.level}</span>
                </div>
                <p className="text-slate-500 text-sm line-clamp-1 mb-2">{word.chinese}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">{word.category}</span>
                  {word.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">没有找到匹配的单词</p>
            <button onClick={() => {setSearchTerm(''); setSelectedLevel('ALL')}} className="mt-2 text-primary text-sm font-bold hover:underline">清除筛选</button>
          </div>
        )}

        {/* Load More Trigger */}
        {visibleCount < filteredWords.length && (
          <div className="flex justify-center py-8">
            <button 
              onClick={handleLoadMore}
              className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-full hover:bg-slate-50 hover:text-primary shadow-sm transition-all"
            >
              加载更多 ({filteredWords.length - visibleCount})
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