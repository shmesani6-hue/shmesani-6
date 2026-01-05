
import React from 'react';
import { CurrencyInfo, Language } from '../types';

interface CurrencyCardProps {
  currency: CurrencyInfo;
  value: string;
  onChange: (value: string) => void;
  lang: Language;
  isActive: boolean;
}

const CurrencyCard: React.FC<CurrencyCardProps> = ({ currency, value, onChange, lang, isActive }) => {
  const isRtl = lang === 'ar';

  return (
    <div className={`
      relative overflow-hidden transition-all duration-300
      bg-white dark:bg-slate-900 
      rounded-[2rem] p-5
      border-2 ${isActive 
        ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
        : 'border-slate-100 dark:border-slate-800 shadow-sm'}
    `}>
      <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl text-3xl shadow-inner">
            {currency.flag}
          </div>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
              {currency.code}
            </p>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {isRtl ? currency.nameAr : currency.nameEn}
            </h3>
          </div>
        </div>
        <div className={`text-xl font-bold text-slate-300 dark:text-slate-700`}>
          {currency.symbol}
        </div>
      </div>
      
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className={`
            w-full bg-slate-50 dark:bg-slate-950/50 
            rounded-2xl py-4 px-5 
            text-3xl font-bold text-slate-900 dark:text-white
            outline-none transition-all
            placeholder:text-slate-200 dark:placeholder:text-slate-800
            ${isRtl ? 'text-right' : 'text-left'}
            focus:bg-white dark:focus:bg-slate-950
          `}
        />
        {isActive && (
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-blue-500 rounded-full opacity-50`} />
        )}
      </div>
    </div>
  );
};

export default CurrencyCard;
