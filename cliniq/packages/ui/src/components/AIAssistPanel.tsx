import React, { useState } from 'react';

interface Suggestion {
  id: string;
  title: string;
  snippet: string;
  relevance: number;
}

interface AIAssistPanelProps {
  query: string;
  suggestions?: Suggestion[];
  loading?: boolean;
  onDismiss?: () => void;
  onOpenFullChat?: () => void;
}

export function AIAssistPanel({ 
  query, 
  suggestions = [], 
  loading = false,
  onDismiss,
  onOpenFullChat 
}: AIAssistPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasContent = suggestions.length > 0 || loading;

  if (!hasContent && !query) return null;

  return (
    <div className="rounded-lg border border-teal-200 bg-teal-50/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-medium text-teal-900">GhanaHealth AI</span>
        </div>
        <div className="flex items-center gap-2">
          {hasContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-teal-700 hover:text-teal-900"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-xs text-teal-700 hover:text-teal-900"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-teal-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
              Searching for relevant answers...
            </div>
          )}

          {!loading && suggestions.length === 0 && query && (
            <div className="text-sm text-teal-700">
              No relevant answers found for "{query}". Try rephrasing your question.
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-teal-900">
                Found {suggestions.length} relevant answer{suggestions.length !== 1 ? 's' : ''}:
              </p>
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="rounded border border-teal-200 bg-white p-3 text-sm"
                >
                  <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                  <p className="text-gray-600 text-xs line-clamp-2">{suggestion.snippet}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-teal-600">
                      {Math.round(suggestion.relevance * 100)}% relevant
                    </span>
                    <a
                      href="#"
                      className="text-xs text-teal-700 hover:text-teal-900 underline"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle navigation to suggestion
                      }}
                    >
                      View answer
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {onOpenFullChat && (
            <div className="pt-2 border-t border-teal-200">
              <button
                onClick={onOpenFullChat}
                className="w-full rounded bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
              >
                Ask GhanaHealth AI about this topic
              </button>
            </div>
          )}

          <div className="text-xs text-gray-600 mt-3">
            💡 These suggestions are powered by AI to help you find relevant answers. Always verify critical information.
          </div>
        </div>
      )}
    </div>
  );
}
