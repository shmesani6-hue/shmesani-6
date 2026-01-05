
import { CurrencyInfo, TranslationStrings } from './types';

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  {
    code: 'USD',
    nameEn: 'United States Dollar',
    nameAr: 'دولار أمريكي',
    symbol: '$',
    flag: '🇺🇸',
  },
  {
    code: 'EGP',
    nameEn: 'Egyptian Pound',
    nameAr: 'جنيه مصري',
    symbol: 'E£',
    flag: '🇪🇬',
  },
  {
    code: 'IQD',
    nameEn: 'Iraqi Dinar',
    nameAr: 'دينار عراقي',
    symbol: 'ع.د',
    flag: '🇮🇶',
  },
];

export const TRANSLATIONS: Record<'en' | 'ar', TranslationStrings> = {
  en: {
    title: 'ProFX Converter',
    subtitle: 'Real-time currency exchange rates',
    lastUpdated: 'Last Updated',
    loading: 'Fetching latest rates...',
    error: 'Failed to sync rates. Try again.',
    refresh: 'Refresh Rates',
    enterAmount: 'Enter amount',
  },
  ar: {
    title: 'برو إف إكس',
    subtitle: 'أسعار صرف العملات في الوقت الفعلي',
    lastUpdated: 'آخر تحديث',
    loading: 'جاري جلب الأسعار...',
    error: 'فشل مزامنة الأسعار. حاول ثانية.',
    refresh: 'تحديث الأسعار',
    enterAmount: 'أدخل المبلغ',
  },
};

export const API_URL = 'https://open.er-api.com/v6/latest/USD';
