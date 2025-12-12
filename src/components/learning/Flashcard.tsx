import React, { useState } from 'react';
import { Volume2, RotateCw, X, AlertCircle } from 'lucide-react';
import { Word } from '../../types';
import { ttsManager } from '../../utils/TTSManager';

interface FlashcardProps {
  word: Word;
  onClose: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = async (e: React.MouseEvent, text: string, mp3: string | null) => {
    e.stopPropagation();
    if (isPlaying) return;

    setError(null);
    setIsPlaying(true);
    try {
      await ttsManager.speakText(text, { audio_mp3: mp3 });
    } catch (err) {
      setError("无法播放发音，请检查设备设置");
      console.error(err);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              word.level === 'A1' ? 'bg-green-100 text-green-700' :
              word.level === 'A2' ? 'bg-emerald-100 text-emerald-700' :
              word.level === 'B1' ? 'bg-blue-100 text-blue-700' :
              word.level === 'B2' ? 'bg-indigo-100 text-indigo-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {word.level}
            </span>
            <span className="px-2 py-1 rounded text-xs font-bold bg-slate-200 text-slate-600">
              {word.category}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-8 text-center scrollbar-hide">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-800 break-words">{word.french}</h2>
            <p className="text-slate-400 font-mono text-lg">{word.ipa}</p>
            
            <div className="flex justify-center py-4">
               <button 
                  onClick={(e) => handlePlay(e, word.french, word.audio_mp3)}
                  disabled={isPlaying}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isPlaying ? 'bg-blue-100 text-blue-400 scale-95' : 'bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 active:scale-95'
                  }`}
                  aria-label="播放读音"
                >
                  <Volume2 size={32} className={isPlaying ? 'animate-pulse' : ''} />
                </button>
            </div>
            
            {error && (
              <div className="flex items-center justify-center gap-2 text-xs text-red-500 bg-red-50 p-2 rounded-lg">
                <AlertCircle size={14} /> {error}
              </div>
            )}
          </div>

          <div 
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isFlipped ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
          >
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{word.part_of_speech}</span>
                <p className="text-2xl font-medium text-slate-800 mt-1">{word.chinese}</p>
              </div>
              
              {/* Context/Example Box */}
              <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-100">
                <p className="text-slate-700 font-medium mb-1">{word.example}</p>
                <p className="text-slate-500 text-sm">{word.example_chinese}</p>
                <button 
                  onClick={(e) => handlePlay(e, word.example, null)} 
                  className="mt-3 text-primary text-xs flex items-center gap-1 font-bold hover:underline"
                >
                  <Volume2 size={12} /> 播放例句
                </button>
              </div>

              {/* Extra Info */}
              {(word.gender || word.plural) && (
                <div className="flex justify-center gap-4 text-xs text-slate-500">
                  {word.gender && <span>性: {word.gender}</span>}
                  {word.plural && <span>复: {word.plural}</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl shadow-sm hover:bg-blue-50 hover:text-primary hover:border-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <RotateCw size={18} className={`transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
            {isFlipped ? "隐藏释义" : "显示释义"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;