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
      setError("无法播放");
      console.error(err);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[85vh] transition-transform scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Card Header */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
          <div className="pointer-events-auto flex gap-2">
             <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-sm ${
              word.level === 'A1' ? 'bg-green-100 text-green-700' :
              word.level === 'A2' ? 'bg-emerald-100 text-emerald-700' :
              word.level === 'B1' ? 'bg-blue-100 text-blue-700' :
              word.level === 'B2' ? 'bg-indigo-100 text-indigo-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {word.level}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 text-slate-600 border border-slate-100 shadow-sm backdrop-blur">
              {word.category}
            </span>
          </div>
          <button onClick={onClose} className="pointer-events-auto bg-slate-100 p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          <div className="pt-24 pb-10 px-8 text-center bg-gradient-to-b from-slate-50 to-white">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-4 tracking-tight">{word.french}</h2>
            <p className="text-slate-400 font-mono text-xl tracking-wide bg-slate-50 inline-block px-4 py-1 rounded-lg border border-slate-100">{word.ipa}</p>
            
            <div className="flex justify-center mt-8">
               <button 
                  onClick={(e) => handlePlay(e, word.french, word.audio_mp3)}
                  disabled={isPlaying}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg shadow-primary-500/30 ${
                    isPlaying 
                      ? 'bg-primary-100 text-primary-600 scale-95 ring-4 ring-primary-100' 
                      : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 hover:shadow-primary-500/50'
                  }`}
                  aria-label="播放读音"
                >
                  <Volume2 size={36} className={isPlaying ? 'animate-pulse' : ''} />
                </button>
            </div>
            
            {error && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-red-500 bg-red-50 py-1 px-3 rounded-full mx-auto w-fit">
                <AlertCircle size={12} /> {error}
              </div>
            )}
          </div>

          <div 
            className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden bg-slate-50 border-t border-slate-100 ${isFlipped ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-8 space-y-6">
              <div className="text-center">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{word.part_of_speech}</span>
                <p className="text-3xl font-bold text-slate-800 mt-2">{word.chinese}</p>
              </div>
              
              {/* Example Box */}
              <div className="bg-white p-6 rounded-2xl text-left border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                <p className="text-xl font-serif text-slate-800 mb-2 leading-relaxed">{word.example}</p>
                <p className="text-slate-500 text-sm font-medium">{word.example_chinese}</p>
                <button 
                  onClick={(e) => handlePlay(e, word.example, null)} 
                  className="mt-4 text-primary-600 text-xs flex items-center gap-1.5 font-bold hover:bg-primary-50 px-3 py-1.5 rounded-lg w-fit transition-colors"
                >
                  <Volume2 size={14} /> 播放例句
                </button>
              </div>

              {/* Extra Info */}
              {(word.gender || word.plural) && (
                <div className="flex justify-center gap-3">
                  {word.gender && <span className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">Gen: {word.gender}</span>}
                  {word.plural && <span className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">Pl: {word.plural}</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-5 border-t border-slate-100 bg-white shrink-0 z-20">
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.99] flex items-center justify-center gap-3 text-lg"
          >
            <RotateCw size={20} className={`transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
            {isFlipped ? "隐藏详细释义" : "查看详细释义"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;