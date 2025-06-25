import { useEffect, useState } from 'react';

export function useDebounce(delay = 300) {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState(null);

  useEffect(() => {
    const delayFn = setTimeout(() => setSearch(searchQuery), delay);
    return () => clearTimeout(delayFn);
  }, [searchQuery, delay]);

  return [search, setSearchQuery];
}