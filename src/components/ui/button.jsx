import React from 'react';

export function Button({ children, className, ...props }) {
  return (
    <button
      className={`px-2 py-1 m-0.5 md:px-4 md:py-2 rounded-md font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
