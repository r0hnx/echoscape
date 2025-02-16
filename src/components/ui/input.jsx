import React from "react";

export function Input({ value, onChange, placeholder = "Enter text", className = "" }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`p-2 border rounded-lg bg-gray-800 text-white ${className}`}
    />
  );
}
