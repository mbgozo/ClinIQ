"use client";

import { useState } from "react";

export default function ChatSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // This would call the search API
      const results = await fetch(`/api/chat/search?q=${encodeURIComponent(searchQuery)}&conversationId=${selectedConversation}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('cliniq_access_token')}`,
        },
      });
      
      if (results.ok) {
        const data = await results.json();
        setSearchResults(data.data || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Messages</h1>
        <p className="text-gray-600">
          Search through your chat history and conversations.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Query</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search messages..."
              className="w-full rounded border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Conversation (Optional)</label>
              <select
                value={selectedConversation}
                onChange={(e) => setSelectedConversation(e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All Conversations</option>
                {/* This would be populated with actual conversations */}
                <option value="conv1">General Chat</option>
                <option value="conv2">Study Group</option>
                <option value="conv3">Direct Message</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
                className="rounded bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white border rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {searchResults.map((result) => (
              <div key={result.id} className="p-6 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start gap-4">
                  {/* Message Sender */}
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">👤</span>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">
                        {result.sender?.name || 'Unknown User'}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(result.createdAt)}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {result.conversation?.name || 'Conversation'}
                      </span>
                    </div>

                    {/* Message Text with Highlighting */}
                    <div className="text-gray-700 mb-2">
                      {highlightText(result.content, searchQuery)}
                    </div>

                    {/* File/Message Type Info */}
                    {result.type !== 'TEXT' && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>📎</span>
                        <span>{result.fileName || 'File'}</span>
                        {result.fileSize && (
                          <span>({(result.fileSize / 1024).toFixed(1)} KB)</span>
                        )}
                      </div>
                    )}

                    {/* Reply Information */}
                    {result.replyTo && (
                      <div className="text-sm text-gray-500 italic">
                        Replying to: {highlightText(result.replyTo.content, searchQuery)}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      // Navigate to the conversation and scroll to message
                      window.location.href = `/chat?conversation=${result.conversationId}&message=${result.id}`;
                    }}
                    className="flex-shrink-0 rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && !isSearching && searchResults.length === 0 && (
        <div className="bg-white border rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search terms or browse different conversations
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Search Tips */}
      {!searchQuery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Search Tips</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Use specific keywords to find relevant messages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Search by file names to find shared documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Filter by conversation to narrow down results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Search is case-insensitive and matches partial words</span>
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}
