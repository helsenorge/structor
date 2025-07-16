import { useState, useEffect } from "react";
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return (): void => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}
export default useDebounce;
