import React from 'react';

interface Props {
  progress: number;
}

const ProgressBar: React.FC<Props> = ({ progress }) => {
  const safeProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mb-6">
      <div 
        className="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-full"
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
