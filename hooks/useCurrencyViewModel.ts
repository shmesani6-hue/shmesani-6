
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ExchangeRates, ExchangeRateApiResponse, Language, CurrencyCode } from '../types';
import { API_URL, TRANSLATIONS } from '../constants';

export const useCurrencyViewModel = (lang: Language) => {
  // Data States
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Input States
  const [activeValue, setActiveValue] = useState<string>('1');
  const [activeCode, setActiveCode] = useState<CurrencyCode>('USD');

  const t = useMemo(() => TRANSLATIONS[lang], [lang]);

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network error');
      const data: ExchangeRateApiResponse = await response.json();
      
      setRates(data.rates);
      const date = new Date(data.time_last_update_utc);
      setLastUpdated(date.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: 'numeric',
        month: 'short'
      }));
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  }, [lang, t.error]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const convertValue = useCallback((targetCode: CurrencyCode): string => {
    if (!rates) return '';
    if (targetCode === activeCode) return activeValue;

    const valueNum = parseFloat(activeValue);
    if (isNaN(valueNum)) return '';

    const baseValue = valueNum / (rates[activeCode] || 1);
    const targetValue = baseValue * (rates[targetCode] || 1);

    // Format for display: avoid scientific notation and limit decimals
    if (targetValue < 0.0001 && targetValue > 0) return targetValue.toFixed(6);
    return Number(targetValue.toFixed(4)).toString();
  }, [rates, activeValue, activeCode]);

  const handleInputChange = (code: CurrencyCode, value: string) => {
    // Basic sanitization for numeric input
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setActiveCode(code);
      setActiveValue(value);
    }
  };

  return {
    rates,
    lastUpdated,
    isLoading,
    error,
    activeValue,
    activeCode,
    t,
    fetchRates,
    convertValue,
    handleInputChange
  };
};
