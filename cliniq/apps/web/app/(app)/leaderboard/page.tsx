"use client";

import { useState } from "react";
import { useLeaderboard } from "@cliniq/ui";
import { BadgePill, ReputationDisplay } from "@cliniq/ui";

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");
  
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center text-gray-500">Loading leaderboard...</div>
      </main>
    );
  }

  if (!leaderboard) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center text-red-600">Failed to load leaderboard.</div>
      </main>
    );
  }

  // Mock user ID - replace with actual auth context
  const currentUserId = "mock-user-id";

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-600";
      case 2: return "text-gray-400";
      case 3: return "text-amber-600";
      default: return "text-gray-600";
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">
          Top contributors in the ClinIQ community. Earn reputation by answering questions and helping fellow students.
        </p>
      </div>

      {/* Time Filter */}
      <div className="mb-6">
        <div className="flex gap-2">
          {["all", "month", "week"].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeFilter === filter
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter === "all" ? "All Time" : filter === "month" ? "This Month" : "This Week"}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {leaderboard.slice(0, 3).map((user, index) => {
          const position = index + 1;
          const isCurrentUser = user.id === currentUserId;
          
          return (
            <div 
              key={user.id}
              className={`relative bg-white border-2 rounded-lg p-6 text-center ${
                position === 1 ? "border-yellow-400" : 
                position === 2 ? "border-gray-300" : 
                "border-amber-400"
              } ${isCurrentUser ? "ring-2 ring-teal-500 ring-offset-2" : ""}`}
            >
              {/* Rank Icon */}
              <div className={`text-4xl mb-4 ${getRankColor(position)}`}>
                {getRankIcon(position)}
              </div>
              
              {/* Avatar */}
              <div className="h-16 w-16 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              
              {/* Name */}
              <h3 className="font-semibold text-gray-900 mb-1">
                {user.name} {isCurrentUser && "(You)"}
              </h3>
              
              {/* Institution */}
              <p className="text-sm text-gray-600 mb-4">{user.institution}</p>
              
              {/* Reputation */}
              <ReputationDisplay
                reputation={user.totalReputation}
                level={user.level}
                nextLevelReputation={user.nextLevelReputation}
                showProgress={false}
                className="justify-center"
              />
              
              {/* Badge Count */}
              <div className="mt-4 text-sm text-gray-600">
                <strong>{user.badgeCount}</strong> badges earned
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="divide-y">
          {leaderboard.map((user, index) => {
            const position = index + 1;
            const isCurrentUser = user.id === currentUserId;
            
            return (
              <div 
                key={user.id}
                className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                  isCurrentUser ? "bg-teal-50" : ""
                }`}
              >
                {/* Rank */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${getRankColor(position)}`}>
                  {getRankIcon(position)}
                </div>
                
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {user.name}
                    </span>
                    {isCurrentUser && (
                      <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {user.institution} • {user.program}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {user.totalReputation.toLocaleString()} pts
                  </div>
                  <div className="text-sm text-gray-600">{user.level}</div>
                  <div className="text-xs text-gray-500">{user.badgeCount} badges</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How to Earn Section */}
      <div className="mt-8 bg-teal-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-teal-900 mb-3">How to Earn Reputation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-teal-800">
          <div>
            <strong>Post an answer:</strong> +10 reputation
          </div>
          <div>
            <strong>Get answer accepted:</strong> +50 reputation
          </div>
          <div>
            <strong>Receive upvote on answer:</strong> +5 reputation
          </div>
          <div>
            <strong>Receive upvote on question:</strong> +2 reputation
          </div>
        </div>
        <p className="text-sm text-teal-700 mt-4">
          Earn badges for special achievements and climb the leaderboard!
        </p>
      </div>
    </main>
  );
}
