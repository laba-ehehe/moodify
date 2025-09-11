import React from 'react';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Creating your perfect playlist...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;