import React from 'react';

interface Props {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

const DifficultyBadge: React.FC<Props> = ({ difficulty }) => {
  const config = {
    EASY: { bg: 'bg-green-100', text: 'text-green-700', label: 'Easy' },
    MEDIUM: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Med' },
    HARD: { bg: 'bg-red-100', text: 'text-red-700', label: 'Hard' }
  };

  const { bg, text, label } = config[difficulty];

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${bg} ${text}`}>
      {label}
    </span>
  );
};

export default DifficultyBadge;
