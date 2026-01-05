
export type CurrencyCode = 'USD' | 'EGP' | 'IQD';

export interface CurrencyInfo {
  code: CurrencyCode;
  nameEn: string;
  nameAr: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface ExchangeRateApiResponse {
  result: string;
  base_code: string;
  rates: ExchangeRates;
  time_last_update_utc: string;
}

export type Language = 'en' | 'ar';

export interface TranslationStrings {
  title: string;
  subtitle: string;
  lastUpdated: string;
  loading: string;
  error: string;
  refresh: string;
  enterAmount: string;
}
