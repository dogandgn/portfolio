import React from 'react';

const variants = {
  default: 'bg-void border-gunmetal text-fog',
  overlay: 'bg-black/70 border-white/20 text-white backdrop-blur-sm',
};

export default function TechBadge({ text, variant = 'default' }) {
  return (
    <span className={`px-2.5 py-1 border rounded text-[11px] font-medium ${variants[variant]}`}>
      {text}
    </span>
  );
}
