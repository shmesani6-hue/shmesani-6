
import React, { useState, useEffect } from 'react';
import { RefreshCcw, Moon, Sun, Globe, AlertCircle, TrendingUp } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from './constants';
import { Language } from './types';
import CurrencyCard from './components/CurrencyCard';
import { useCurrencyViewModel } from './hooks/useCurrencyViewModel';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const vm = useCurrencyViewModel(lang);
  const isRtl = lang === 'ar';

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ar' : 'en');
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* App Bar */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-lg mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {vm.t.title}
              </h1>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                {vm.t.subtitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleLanguage}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-90"
            >
              <Globe size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-90"
            >
              {isDarkMode ? (
                <Sun size={20} className="text-amber-400" />
              ) : (
                <Moon size={20} className="text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8 space-y-6">
        {/* Sync Status Chip */}
        <div className={`
          flex items-center justify-between px-5 py-3 rounded-2xl
          bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm
        `}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${vm.isLoading ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{vm.t.lastUpdated}</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {vm.isLoading ? vm.t.loading : vm.lastUpdated}
              </p>
            </div>
          </div>
          <button 
            onClick={vm.fetchRates}
            disabled={vm.isLoading}
            className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-all active:rotate-180 disabled:opacity-30"
          >
            <RefreshCcw size={18} className={vm.isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Error Feedback */}
        {vm.error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 animate-bounce">
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{vm.error}</span>
          </div>
        )}

        {/* Currency Card Stack */}
        <div className="space-y-4">
          {SUPPORTED_CURRENCIES.map((currency) => (
            <CurrencyCard
              key={currency.code}
              currency={currency}
              value={vm.convertValue(currency.code)}
              isActive={vm.activeCode === currency.code}
              onChange={(val) => vm.handleInputChange(currency.code, val)}
              lang={lang}
            />
          ))}
        </div>

        {/* Mobile Info Sheet */}
        <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-black rounded-[2.5rem] text-white shadow-xl">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-400" />
            {isRtl ? 'تحليل السوق' : 'Market Insight'}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            {isRtl 
              ? 'تعتمد دقة البيانات على ExchangeRate-API. يتم تحديث الأسعار بانتظام لضمان أفضل تجربة تحويل للعملات المتوفرة.' 
              : 'Precision data provided by ExchangeRate-API. Rates are synchronized regularly to ensure the most accurate conversion experience.'}
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-tight">Real-time</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-tight">MVVM Pattern</span>
          </div>
        </div>
      </main>

      {/* Bottom Padding for Mobile Spacing */}
      <footer className="py-8 text-center">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
          © {new Date().getFullYear()} Eagle Financial Systems
        </p>
      </footer>
    </div>
  );
};

export default App;
