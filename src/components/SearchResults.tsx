import { Message } from '@/types';

interface SearchResultsProps {
  searchResults: Message[];
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
              {result.role === "user" ? <div className="text-white text-md text-right">
                <span className="bg-[#2E2E2E] rounded-xl p-4 inline-block">
                  <span className=" text-sm">{result.content}</span>
                </span>
              </div>

                :
                <div>
                  <div className="max-w-[80vw]">
                    <p className="text-gray-200 text-base leading-relaxed ">{result.content}</p>
                  </div>
                  {result.source && result.source.length > 0 && (
                    <div className=" rounded-lg ">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {result.source.map((source, sourceIndex) => (
                          <div key={sourceIndex} className=" rounded-lg p-3 border border-[#3E3E3E] bg-[#2E2E2E]">
                            <h5 className="text-white font-medium text-sm mb-1 truncate" title={source.title}>
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

              }
            </div>
          ))}
        </div>
      )}


      {/* Sources Section */}


      {/* Thinking process - below search results */}
      {thinkingProcess.length > 0 && (
        <div className="max-w-4xl mx-auto mt-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-gray-300 text-sm">
                {thinkingProcess[thinkingProcess.length - 1]}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
