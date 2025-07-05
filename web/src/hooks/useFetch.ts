import { useCallback, useEffect, useState } from "react";

export const useFetch = <T>(
  url: string,
  options: RequestInit = {},
  initialFetch?: boolean,
): {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<T | undefined>;
  reset: () => void;
} => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchData = useCallback(async (): Promise<T | undefined> => {
    try {
      setIsLoading(true);
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: T = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);
  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  }, [url, options, fetchData, initialFetch]);
  const reset = useCallback((): void => {
    setData(null);
    setIsLoading(true);
    setError(null);
  }, []);
  return { data, isLoading, error, fetchData, reset };
};
