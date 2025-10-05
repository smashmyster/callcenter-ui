import { useState } from 'react';

export interface SearchResult {
  query: string;
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    snippet: string;
  }>;
}

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [thinkingProcess, setThinkingProcess] = useState<string[]>([]);

  const searchDocs = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setThinkingProcess([]);
    
    // Thinking process animation
    const thinkingSteps = [
      "Analyzing your question...",
      "Searching through documents...",
      "Finding relevant information...",
      "Processing results...",
      "Generating answer..."
    ];
    
    let stepIndex = 0;
    const thinkingInterval = setInterval(() => {
      if (stepIndex < thinkingSteps.length) {
        setThinkingProcess(prev => [...prev, thinkingSteps[stepIndex]]);
        stepIndex++;
        
        // Auto-scroll when thinking process updates
        setTimeout(() => {
          const container = document.querySelector('.overflow-y-auto');
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 50);
      } else {
        clearInterval(thinkingInterval);
      }
    }, 800);

    try {
      const response = await fetch(`http://localhost:8787/docs/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          size: 5
        })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const result = await response.json();
      console.log('Search results:', result);
      setSearchResults(prev => [...prev, result]);
      
      // Auto-scroll to bottom when result arrives
      setTimeout(() => {
        const container = document.querySelector('.overflow-y-auto');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
      
    } catch (error) {
      console.error('Search error:', error);
      // Don't clear results on error, keep existing ones
    } finally {
      clearInterval(thinkingInterval);
      setIsSearching(false);
      setThinkingProcess([]);
    }
  };

  const clearResults = () => {
    setSearchResults([]);
  };

  return {
    searchResults,
    isSearching,
    thinkingProcess,
    searchDocs,
    clearResults
  };
};
