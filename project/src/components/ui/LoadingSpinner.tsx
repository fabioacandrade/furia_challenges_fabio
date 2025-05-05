import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-furia-accent"></div>
      <span className="ml-3 text-furia-accent font-medium">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;