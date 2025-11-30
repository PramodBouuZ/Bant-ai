import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 w-max max-w-xs px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg transition-opacity duration-200 opacity-100 ${positionClasses[position]}`}>
          {text}
          {/* Triangle pointer */}
          <div className={`absolute w-0 h-0 border-4 border-transparent ${
            position === 'top' ? 'border-t-gray-800 top-full left-1/2 -translate-x-1/2' :
            position === 'bottom' ? 'border-b-gray-800 bottom-full left-1/2 -translate-x-1/2' :
            position === 'left' ? 'border-l-gray-800 left-full top-1/2 -translate-y-1/2' :
            'border-r-gray-800 right-full top-1/2 -translate-y-1/2'
          }`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;