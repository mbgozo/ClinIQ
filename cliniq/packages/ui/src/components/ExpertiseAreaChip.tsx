import { ExpertiseArea, EXPERTISE_AREA_DEFINITIONS } from '@cliniq/shared-types';

interface ExpertiseAreaChipProps {
  area: ExpertiseArea;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function ExpertiseAreaChip({ area, size = 'md', showIcon = true, className = '' }: ExpertiseAreaChipProps) {
  const definition = EXPERTISE_AREA_DEFINITIONS[area];
  
  if (!definition) return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${className}`}
      style={{ 
        backgroundColor: `${definition.color}20`,
        color: definition.color,
        border: `1px solid ${definition.color}40`
      }}
    >
      {showIcon && <span>{definition.icon}</span>}
      {definition.name}
    </span>
  );
}
