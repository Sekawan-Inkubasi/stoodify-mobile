import React, { useState } from 'react';
import { X, Crown, Check, Shield, ArrowRight } from 'lucide-react';

interface ProPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export const ProPaywallModal: React.FC<ProPaywallModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
}) => {
  if (!isOpen) return null;

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'semester'>('semester');

  const handleUpgrade = () => {
    alert('Terima kasih! Akunmu telah berhasil di-upgrade ke Stoodify Siswa Pro 🎉');
    onUpgradeSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm backdrop-smooth flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-[38px] sm:rounded-[38px] max-h-[92vh] flex flex-col shadow-2xl modal-enter-smooth overflow-hidden">
        
        {/* Top Banner with Crown */}
        <div className="bg-gradient-to-br from-[#0062FF] via-indigo-600 to-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-400/30">
            <Crown className="w-8 h-8 fill-current" />
          </div>

          <h2 className="text-xl font-bold tracking-tight">Stoodify Siswa Pro 💎</h2>
          <p className="text-blue-100 text-xs mt-1 max-w-xs mx-auto font-normal">
            Buka seluruh potensi asisten belajarmu tanpa batasan kuota prompt AI
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Perks list */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-3xl border border-slate-100">
            {[
              'Rekomendasi Jadwal AI Tanpa Batas Prompt',
              'Adaptive Rescheduling Instan Saat Jadwal Terlewat',
              'Akses Penuh Prediksi Materi & Analisis Prasyarat',
              'Zen Focus Timer & Pengatur Suara Lofi',
              'Sinkronisasi Otomatis Kalender Sekolah',
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-2.5 text-slate-700">
                <div className="w-4 h-4 rounded-full bg-[#0062FF] text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3px]" />
                </div>
                <span className="font-medium text-[11px]">{perk}</span>
              </div>
            ))}
          </div>

          {/* Pricing Selector Cards */}
          <div className="space-y-2">
            {/* Semester Plan (Recommended) */}
            <div
              onClick={() => setSelectedPlan('semester')}
              className={`p-4 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all relative ${
                selectedPlan === 'semester'
                  ? 'border-[#0062FF] bg-blue-50/60 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="absolute -top-2.5 right-5 bg-amber-400 text-slate-900 text-[9px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Hemat 60%
              </span>
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Paket 1 Semester (6 Bulan)</span>
                <span className="text-[10px] text-slate-500 font-normal">Hanya Rp 16.500 / bulan</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#0062FF]">Rp 99.000</span>
                <span className="block text-[9px] text-slate-400 line-through">Rp 174.000</span>
              </div>
            </div>

            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-[#0062FF] bg-blue-50/60 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Paket Bulanan</span>
                <span className="text-[10px] text-slate-500 font-normal">Bisa dibatalkan kapan saja</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">Rp 29.000</span>
                <span className="block text-[9px] text-slate-500">/ bulan</span>
              </div>
            </div>
          </div>

          {/* Guarantee badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-normal pt-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pembayaran aman Google Play & App Store</span>
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            className="w-full bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs py-3.5 rounded-full shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Aktifkan Stoodify Pro</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
