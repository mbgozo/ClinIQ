"use client";

import Link from "next/link";
import { useGamificationProfile, useUserBadges, useLeaderboard, useBadgeDefinitions } from "@cliniq/ui";
import { BadgePill, ReputationDisplay } from "@cliniq/ui";

export default function ProfilePage() {
  // Mock user ID - replace with actual auth context
  const userId = "mock-user-id";
  
  const { data: profile, isLoading: profileLoading } = useGamificationProfile(userId);
  const { data: badges, isLoading: badgesLoading } = useUserBadges(userId);
  const { data: leaderboard } = useLeaderboard();
  const { data: badgeDefinitions } = useBadgeDefinitions();

  if (profileLoading || badgesLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center text-gray-500">Loading profile...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center text-red-600">Failed to load profile.</div>
      </main>
    );
  }

  // Find user's rank in leaderboard
  const userRank = leaderboard?.findIndex(u => u.id === userId) ?? -1;
  const userPosition = userRank >= 0 ? userRank + 1 : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl text-gray-500">👤</span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">John Doe</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>University of Ghana</span>
              <span>•</span>
              <span>Nursing Program</span>
              <span>•</span>
              <span>Year 3</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-teal-600">#{userPosition || '--'}</div>
            <div className="text-sm text-gray-500">Global Rank</div>
          </div>
        </div>

        {/* Reputation Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <ReputationDisplay
            reputation={profile.totalReputation}
            level={profile.level}
            nextLevelReputation={profile.nextLevelReputation}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-gray-900">{profile.totalReputation.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Reputation</div>
        </div>
        
        <div className="bg-white border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{profile.answerReputation.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Answer Reputation</div>
        </div>
        
        <div className="bg-white border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">{profile.badgeCount}</div>
          <div className="text-sm text-gray-600">Badges Earned</div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Badges</h2>
        
        {badges && badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="bg-white border rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">{badge.icon}</div>
                <BadgePill type={badge.type as any} size="sm" className="mb-2" />
                <p className="text-xs text-gray-600">{badge.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Earned {new Date(badge.awardedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            No badges earned yet. Start answering questions to earn your first badge!
          </div>
        )}
      </div>

      {/* Available Badges */}
      {badgeDefinitions && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Badges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badgeDefinitions.map((definition: any) => {
              const isEarned = badges?.some(b => b.type === definition.type);
              
              return (
                <div 
                  key={definition.type} 
                  className={`border rounded-lg p-4 ${isEarned ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{definition.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{definition.name}</h3>
                      <BadgePill type={definition.type as any} size="sm" />
                    </div>
                    {isEarned && (
                      <span className="text-green-600 text-sm font-medium">✓ Earned</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{definition.description}</p>
                  <p className="text-xs text-gray-500">
                    <strong>Requirements:</strong> {definition.requirements}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leaderboard Preview */}
      {leaderboard && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
            <Link href="/leaderboard" className="text-sm text-teal-600 hover:text-teal-700">
              View full leaderboard →
            </Link>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="divide-y">
              {leaderboard.slice(0, 5).map((user, index) => {
                const isCurrentUser = user.id === userId;
                
                return (
                  <div 
                    key={user.id} 
                    className={`p-4 flex items-center gap-4 ${isCurrentUser ? 'bg-teal-50' : ''}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                      {index + 1}
                    </div>
                    
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {user.name} {isCurrentUser && '(You)'}
                      </div>
                      <div className="text-sm text-gray-600">{user.institution}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{user.totalReputation.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{user.level}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
