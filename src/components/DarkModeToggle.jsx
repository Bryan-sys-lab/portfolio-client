import { useEffect, useState } from 'react';

export default function DarkModeToggle({ dark, setDark }) {
  const toggleMode = () => {
    setDark(!dark);
  };

  return (
    <button
      onClick={toggleMode}
      className={`w-12 h-6 flex items-center rounded-full px-1 transition-colors duration-300 ${
        dark ? 'bg-gray-700' : 'bg-yellow-400'
      }`}
      aria-label="Toggle dark mode"
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          dark ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
