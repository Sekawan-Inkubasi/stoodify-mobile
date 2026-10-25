import React, { useState } from 'react';
import { 
  X, 
  Brain, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Lightbulb, 
  Info
} from 'lucide-react';
import { MaterialPrediction } from '../../types';

interface MaterialPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictions: MaterialPrediction[];
}

export const MaterialPredictionModal: React.FC<MaterialPredictionModalProps> = ({
  isOpen,
  onClose,
  predictions: initialPredictions,
}) => {
  if (!isOpen) return null;

  const [predictions, setPredictions] = useState<MaterialPrediction[]>(initialPredictions);

  const handleFeedback = (id: string, feedback: 'accurate' | 'inaccurate') => {
    setPredictions(prev => prev.map(p => p.id === id ? { ...p, userFeedback: feedback } : p));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0062FF] flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Prediksi Materi Selanjutnya</h2>
              <p className="text-[11px] font-normal text-slate-500">Analisis riwayat PR & Kurikulum Merdeka</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Explanation Alert */}
          <div className="bg-blue-50/70 border border-blue-200/60 rounded-3xl p-3.5 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#0062FF] shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              AI membaca pola materi 5 tugas terakhirmu untuk memperkirakan topik bahasan minggu depan, agar kamu bisa curi start belajar lebih santai!
            </p>
          </div>

          {/* Cards for each subject prediction */}
          <div className="space-y-3.5">
            {predictions.map((pred) => (
              <div
                key={pred.id}
                className="bg-white rounded-3xl p-4 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-slate-100 space-y-3 relative overflow-hidden"
              >
                {/* Subject and Confidence Tag */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: pred.subjectColor }}
                  >
                    {pred.subject}
                  </span>

                  <div className="flex items-center gap-1 bg-blue-50 text-[#0062FF] px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>{pred.confidence}% Yakin</span>
                  </div>
                </div>

                {/* Predicted Topic Title */}
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                    Topik Pembelajaran Mendatang
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                    {pred.predictedTopic}
                  </h3>
                </div>

                {/* AI Reasoning */}
                <p className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed font-normal">
                  <strong className="font-semibold text-slate-800">Alasan Analisis:</strong> {pred.reason}
                </p>

                {/* Prerequisites Tags */}
                <div>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                    Materi Prasyarat:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pred.prerequisites.map((req, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full"
                      >
                        ✓ {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preparation Tip */}
                <div className="flex items-start gap-2 bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 text-[11px] text-amber-950 font-normal">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="font-semibold">Saran Curi Start:</strong> {pred.preparationTips}
                  </p>
                </div>

                {/* Feedback User */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <span className="text-[10px] text-slate-400 font-normal">Prediksi ini akurat di kelasmu?</span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleFeedback(pred.id, 'accurate')}
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        pred.userFeedback === 'accurate'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Tepat</span>
                    </button>
                    <button
                      onClick={() => handleFeedback(pred.id, 'inaccurate')}
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        pred.userFeedback === 'inaccurate'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>Meleset</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
