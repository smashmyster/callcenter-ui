import { SearchResult } from '@/hooks/useSearch';

interface SearchResultsProps {
  searchResults: SearchResult[];
  thinkingProcess: string[];
}

export const SearchResults = ({ searchResults, thinkingProcess }: SearchResultsProps) => {
  return (
    <div className="w-full max-h-[80vh] overflow-y-auto">
      {searchResults.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-12">
          {searchResults.map((result, resultIndex) => (
            <div key={resultIndex} className="space-y-8">
              {/* Query on the right */}
              <div className="text-white text-md text-right">
                <span className="bg-gray-800 rounded-lg p-3 inline-block">
                  <span className="text-gray-200 text-sm">{result.query}</span>
                </span>
              </div>
              
              {/* Answer on the left */}
              <div className="max-w-[80vw]">
                <p className="text-gray-200 text-base leading-relaxed">{result.answer}</p>
              </div>

              {/* Sources Section */}
              {result.sources && result.sources.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white text-md font-semibold mb-3">Sources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.sources.map((source, sourceIndex) => (
                      <div key={sourceIndex} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                        <h5 className="text-white font-medium text-sm mb-2 truncate" title={source.title}>
                          {source.title}
                        </h5>
                        <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                          {source.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Thinking process - below search results */}
      {thinkingProcess.length > 0 && (
        <div className="max-w-4xl mx-auto mt-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white text-lg font-semibold mb-3">Thinking...</h3>
            <div className="space-y-2">
              {thinkingProcess.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
