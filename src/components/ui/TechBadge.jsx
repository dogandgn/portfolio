import React from 'react';

export default function TechBadge({ text }) {
  return (
    <span className="px-2.5 py-1 bg-void border border-gunmetal rounded text-[10px] text-fog font-medium uppercase tracking-widest">
      {text}
    </span>
  );
}