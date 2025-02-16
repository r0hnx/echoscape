import React from "react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      
      <div onClick={() => onOpenChange(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
          {children}
          </div>
        </div>
    </div>
  );
}
