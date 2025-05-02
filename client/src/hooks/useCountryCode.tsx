import { useState, useEffect } from 'react';
import { getUserCountry } from '@/lib/api';

export function useCountryCode() {
  const [countryCode, setCountryCode] = useState<string>('US'); // Default to US
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        // First try to get from localStorage for faster loads on return visits
        const savedCountryCode = localStorage.getItem('userCountryCode');
        
        if (savedCountryCode) {
          setCountryCode(savedCountryCode);
          setLoading(false);
          return;
        }

        // If not in localStorage, fetch from API
        const code = await getUserCountry();
        setCountryCode(code);
        
        // Save to localStorage for future use
        localStorage.setItem('userCountryCode', code);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get country code'));
        console.error('Failed to get country code:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryCode();
  }, []);

  return { countryCode, loading, error };
}
