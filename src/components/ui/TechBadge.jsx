import React from 'react';

export default function TechBadge({ text }) {
  return (
    <span className="px-3 py-1 bg-slate-800 text-sky-400 text-xs font-medium rounded-full border border-slate-700">
      {text}
    </span>
  );
}