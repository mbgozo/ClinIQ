import React from 'react';
import { BadgeType, BADGE_DEFINITIONS } from '@cliniq/shared-types';

interface BadgePillProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function BadgePill({ type, size = 'md', showTooltip = true, className = '' }: BadgePillProps) {
  const definition = BADGE_DEFINITIONS[type];
  
  if (!definition) return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const tierColors = {
    BRONZE: 'bg-amber-100 text-amber-800 border-amber-200',
    SILVER: 'bg-gray-100 text-gray-800 border-gray-200',
    GOLD: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PLATINUM: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const baseClasses = `inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses[size]} ${tierColors[definition.tier]} ${className}`;

  return (
    <div className={baseClasses} title={showTooltip ? definition.description : undefined}>
      <span className="text-xs">{definition.icon}</span>
      <span>{definition.name}</span>
    </div>
  );
}
