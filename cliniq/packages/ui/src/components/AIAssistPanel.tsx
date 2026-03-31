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
            {/* Sparkle / AI icon */}
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
            <svg className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            AI-powered suggestions to help you find relevant answers. Always verify critical information.
          </div>
        </div>
      )}
    </div>
  );
}
