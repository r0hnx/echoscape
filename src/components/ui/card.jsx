import React from 'react';

export function Card({ children, className, onClick }) {
  return <div onClick={onClick} className={`shadow-md rounded-lg ${className}`}>{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
