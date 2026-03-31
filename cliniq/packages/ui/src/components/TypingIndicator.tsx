interface TypingIndicatorProps {
  users: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
  }>;
  className?: string;
}

export function TypingIndicator({ users, className = '' }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].name} is typing`;
    }
    
    if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing`;
    }
    
    return `${users.slice(0, -1).map(u => u.name).join(', ')} and ${users[users.length - 1].name} are typing`;
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 ${className}`}>
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      <span className="text-sm text-gray-500 italic">
        {getTypingText()}
      </span>
    </div>
  );
}
