import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle({ dark, setDark }) {
  const toggleMode = () => setDark(!dark);

  return (
    <button
      onClick={toggleMode}
      aria-label="Toggle dark mode"
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300
        ${dark ? 'bg-gray-800 text-white' : 'bg-yellow-300 text-yellow-800'}
      `}
    >
      {dark ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
