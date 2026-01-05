
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCcw, Moon, Sun, Globe, AlertCircle } from 'lucide-react';
import { SUPPORTED_CURRENCIES, TRANSLATIONS, API_URL } from './constants';
import { ExchangeRates, ExchangeRateApiResponse, Language, CurrencyCode } from './types';
import CurrencyCard from './components/CurrencyCard';

const App: React.FC = () => {
  // --- UI State ---
  const [lang, setLang] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // --- Data State ---
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Input State ---
  // We keep track of the active "source" value and which currency it belongs to
  const [activeValue, setActiveValue] = useState<string>('1');
  const [activeCode, setActiveCode] = useState<CurrencyCode>('USD');

  const t = useMemo(() => TRANSLATIONS[lang], [lang]);
  const isRtl = lang === 'ar';

  // --- Fetch Data ---
  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: ExchangeRateApiResponse = await response.json();
      setRates(data.rates);
      setLastUpdated(new Date(data.time_last_update_utc).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'));
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }, [lang, t.error]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // --- Dark Mode Effect ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Conversion Logic ---
  const getConvertedValue = (targetCode: CurrencyCode): string => {
    if (!rates) return '';
    if (targetCode === activeCode) return activeValue;

    // Logic: Convert current value back to base (USD), then to target
    const valueNum = parseFloat(activeValue) || 0;
    const baseValue = valueNum / (rates[activeCode] || 1);
    const targetValue = baseValue * (rates[targetCode] || 1);

    if (targetValue === 0) return '';
    
    // Format for display: max 4 decimals for precision (IQD has huge numbers, EGP is volatile)
    return Number(targetValue.toFixed(4)).toString();
  };

  const handleValueChange = (code: CurrencyCode, value: string) => {
    setActiveCode(code);
    setActiveValue(value);
  };

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ar' : 'en');
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <div className={`min-h-screen pb-12 transition-colors ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.subtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleLanguage}
              className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-slate-600 dark:text-slate-400"
              title="Change Language"
            >
              <Globe size={20} />
            </button>
            <button 
              onClick={toggleDarkMode}
              className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-slate-600 dark:text-slate-400"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 mt-8 space-y-6">
        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-blue-50 dark:bg-blue-900/20 px-6 py-4 rounded-3xl border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              {loading ? t.loading : `${t.lastUpdated}: ${lastUpdated}`}
            </span>
          </div>
          <button 
            onClick={fetchRates}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-sm font-bold text-blue-600 dark:text-blue-400 hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            {t.refresh}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Currency List */}
        <div className="grid grid-cols-1 gap-6">
          {SUPPORTED_CURRENCIES.map((currency) => (
            <CurrencyCard
              key={currency.code}
              currency={currency}
              value={getConvertedValue(currency.code)}
              onChange={(val) => handleValueChange(currency.code, val)}
              lang={lang}
            />
          ))}
        </div>

        {/* Info Section */}
        <section className="mt-12 p-8 bg-slate-100 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            {lang === 'en' ? 'Quick Information' : 'معلومات سريعة'}
          </h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            <p>
              {lang === 'en' 
                ? 'Rates are sourced from global financial markets and updated every 24 hours. This converter allows real-time calculation across all pairs.' 
                : 'يتم جلب الأسعار من الأسواق المالية العالمية وتحديثها كل ٢٤ ساعة. يسمح هذا المحول بالحساب المباشر عبر جميع أزواج العملات.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                ExchangeRate API V6
              </span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                Material Design 3
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-center text-slate-400 dark:text-slate-600 text-xs font-medium">
        <p>© {new Date().getFullYear()} ProFX Mobile Web. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
};

export default App;
