import React from 'react';

export default function StepPanel({ active, id, children }) {
  return (
    <div
      id={id}
      role="region"
      aria-hidden={!active}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        active
          ? 'opacity-100 max-h-[2000px] translate-y-0 pointer-events-auto'
          : 'opacity-0 max-h-0 -translate-y-2 pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
}
