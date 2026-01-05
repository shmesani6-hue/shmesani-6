
import React from 'react';
import { CurrencyInfo, Language } from '../types';

interface CurrencyCardProps {
  currency: CurrencyInfo;
  value: string;
  onChange: (value: string) => void;
  lang: Language;
}

const CurrencyCard: React.FC<CurrencyCardProps> = ({ currency, value, onChange, lang }) => {
  const isRtl = lang === 'ar';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
      <div className={`flex items-center gap-4 mb-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <span className="text-4xl">{currency.flag}</span>
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {isRtl ? currency.nameAr : currency.nameEn}
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {currency.code} • {currency.symbol}
          </p>
        </div>
      </div>
      
      <div className="relative group">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className={`w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-900 focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl p-4 text-2xl font-bold outline-none transition-all ${isRtl ? 'text-right' : 'text-left'}`}
        />
        <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRtl ? 'left-4' : 'right-4'}`}>
          <span className="text-slate-400 font-medium">{currency.symbol}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyCard;
