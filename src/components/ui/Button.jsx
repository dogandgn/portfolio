import React from 'react';

export default function Button({ children, href, primary }) {
  const baseStyle = "px-6 py-3 rounded-full font-medium transition duration-300 inline-flex items-center justify-center tracking-wide text-sm";
  
  const colorStyle = primary
    ? "bg-signal text-white hover:brightness-110"
    : "bg-transparent text-white border border-silver hover:border-white";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${baseStyle} ${colorStyle}`}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${baseStyle} ${colorStyle}`}>
      {children}
    </button>
  );
}