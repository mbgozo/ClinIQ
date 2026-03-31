interface ReputationDisplayProps {
  reputation: number;
  level: string;
  nextLevelReputation: number;
  showProgress?: boolean;
  className?: string;
}

export function ReputationDisplay({ 
  reputation, 
  level, 
  nextLevelReputation, 
  showProgress = true,
  className = '' 
}: ReputationDisplayProps) {
  const progress = nextLevelReputation > 0 
    ? (reputation / nextLevelReputation) * 100 
    : 100;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="text-sm">
        <div className="font-medium text-gray-900">{reputation.toLocaleString()} pts</div>
        <div className="text-xs text-gray-500">{level}</div>
      </div>
      
      {showProgress && nextLevelReputation > reputation && (
        <div className="flex-1 max-w-32">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {nextLevelReputation - reputation} to next level
          </div>
        </div>
      )}
    </div>
  );
}
