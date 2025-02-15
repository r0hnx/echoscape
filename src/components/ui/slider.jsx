import React from 'react';

export function Slider({ defaultValue, min, max, step, onValueChange }) {
  return (
    <input
      type="range"
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className="w-full"
    />
  );
}
