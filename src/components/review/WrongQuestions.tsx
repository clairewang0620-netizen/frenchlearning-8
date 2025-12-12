import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Download, Trash2 } from 'lucide-react';
import { getUserStats, removeWeakWord } from '../../services/storage';
import { UserStats } from '../../types';

const WrongQuestions = () => {
  const [stats, setStats] = useState<UserStats | null>(null);

  const loadStats = () => {
    setStats(getUserStats());
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleResolve = (id: string) => {
    removeWeakWord(id);
    loadStats();
  };

  const handleExport = () => {
    if (!stats) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "lumiere_progress.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!stats) return <div className="p-8 text-center">加载中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">错题本 & 进度</h2>
          <p className="text-slate-500">重点攻克薄弱环节</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 text-primary hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors text-sm font-bold"
        >
          <Download size={18} /> 导出进度
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">做题总数</div>
           <div className="text-3xl font-black text-slate-800">{stats.totalQuestionsAttempted}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">正确率</div>
           <div className="text-3xl font-black text-primary">
             {stats.totalQuestionsAttempted > 0 ? Math.round((stats.correctAnswers / stats.totalQuestionsAttempted) * 100) : 0}%
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">待复习</div>
           <div className="text-3xl font-black text-orange-500">{stats.weakWords.length}</div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <AlertTriangle size={18} className="text-orange-500" />
          <h3 className="font-bold text-slate-700">需复习的知识点</h3>
        </div>
        
        {stats.weakWords.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
             <CheckCircle size={48} className="text-green-400 mb-4 opacity-50" />
             <p>太棒了！目前没有错题记录。</p>
             <p className="text-sm mt-2">去参加测验来发现薄弱点吧。</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.weakWords.map((id) => (
              <div key={id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50 transition-colors group">
                <div>
                   <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-mono mb-1">{id}</span>
                   <p className="text-slate-800 font-medium">题目 ID: {id}</p>
                   <p className="text-slate-400 text-sm">请前往测验区重新练习相关类别</p>
                </div>
                <button 
                  onClick={() => handleResolve(id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <CheckCircle size={16} /> 标记已掌握
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WrongQuestions;