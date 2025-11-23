

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-blue-600' }) => {
  let spinnerSizeClasses = '';
  let borderSizeClasses = '';

  switch (size) {
    case 'sm':
      spinnerSizeClasses = 'w-5 h-5';
      borderSizeClasses = 'border-2';
      break;
    case 'lg':
      spinnerSizeClasses = 'w-12 h-12';
      borderSizeClasses = 'border-4';
      break;
    case 'md':
    default:
      spinnerSizeClasses = 'w-8 h-8';
      borderSizeClasses = 'border-3';
      break;
  }

  return (
    <div className={`inline-block animate-spin rounded-full ${spinnerSizeClasses} ${borderSizeClasses} border-solid ${color} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;