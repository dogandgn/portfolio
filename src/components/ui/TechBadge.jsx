import React from 'react';

export default function TechBadge({ text }) {
  return (
    <span className="px-2.5 py-1 bg-void border border-gunmetal rounded text-[11px] text-fog font-medium">
      {text}
    </span>
  );
}