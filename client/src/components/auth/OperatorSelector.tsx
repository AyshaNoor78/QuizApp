import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const OperatorSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4 my-4">
      <button
        type="button"
        onClick={() => onChange('ROBI')}
        className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
          value === 'ROBI' 
            ? 'border-[#E2001A] bg-red-50 text-[#E2001A] shadow-sm' 
            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
        }`}
      >
        <span className="font-bold text-lg tracking-wider">ROBI</span>
        {value === 'ROBI' && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-[#E2001A] rounded-full" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onChange('AIRTEL')}
        className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
          value === 'AIRTEL' 
            ? 'border-[#ED1C24] bg-red-50 text-[#ED1C24] shadow-sm' 
            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
        }`}
      >
        <span className="font-bold text-lg tracking-wider text-[#ED1C24]">airtel</span>
        {value === 'AIRTEL' && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-[#ED1C24] rounded-full" />
        )}
      </button>
    </div>
  );
};

export default OperatorSelector;
