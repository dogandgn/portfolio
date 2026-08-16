import React from 'react';

export default function Button({ children, href, primary }) {
  const baseStyle = "px-6 py-3 rounded-lg font-medium transition duration-300 inline-flex items-center justify-center";
  
  const colorStyle = primary
    ? "bg-sky-500 text-white hover:bg-sky-400 shadow-lg shadow-sky-500/30"
    : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700";

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