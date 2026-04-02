// React import removed due to modern Next.js/TS config


interface CategoryChipProps {
  category?: { id: string; name: string } | null;
  className?: string;
}

export function CategoryChip({ category, className = '' }: CategoryChipProps) {
  if (!category) return null;

  const colors = {
    'demo-category': 'bg-blue-100 text-blue-800 border-blue-200',
    // Add more category color mappings as needed
  };

  const colorClass = colors[category.id as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass} ${className}`}>
      {category.name}
    </span>
  );
}
