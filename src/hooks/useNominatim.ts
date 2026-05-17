import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

interface UseNominatimReturn {
  results: NominatimResult[];
  isLoading: boolean;
  error: string | null;
}

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_DELAY = 500;

export function useNominatim(query: string): UseNominatimReturn {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  useEffect(() => {
    if (debouncedQuery.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchAddresses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          format: 'json',
          q: debouncedQuery,
          limit: '7',
          addressdetails: '1',
        });

        const response = await fetch(`${NOMINATIM_ENDPOINT}?${params}`, {
          signal: controller.signal,
          headers: {
            // Nominatim Usage Policy: identify your application
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
          },
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data: NominatimResult[] = await response.json();

        if (data.length === 0) {
          setError('Nenhum endereço encontrado.');
          setResults([]);
        } else {
          setResults(data);
          setError(null);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError('Falha ao buscar endereços. Tente novamente.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();

    return () => controller.abort();
  }, [debouncedQuery]);

  return { results, isLoading, error };
}
