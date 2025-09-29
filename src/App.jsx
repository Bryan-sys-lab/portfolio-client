import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Education from './components/Education';
import Experience from './components/Experience';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin'; // moved to own file
import DarkModeToggle from './components/DarkModeToggle';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authHeader = 'Basic ' + btoa(username + ':' + password);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Load credentials from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUsername(parsed.username);
      setPassword(parsed.password);
      setIsAuthenticated(true);
    }
  }, []);

  // Store credentials in localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify({ username, password }));
    } else {
      localStorage.removeItem('auth');
    }
  }, [isAuthenticated, username, password]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white">
      <header className="p-4 shadow-md dark:shadow-gray-800 relative z-40">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          {/* Logo */}
          <div className="text-lg font-bold">
            <Link to="/">BriansPortfolio</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/Projects" className="hover:underline">Projects</Link>
            <Link to="/Experience" className="hover:underline">Experience</Link>
            <Link to="/Education" className="hover:underline">Education</Link>
            <Link to="/Contact" className="hover:underline">Contact</Link>
            {isAuthenticated && <Link to="/Admin" className="hover:underline">Admin</Link>}
          <DarkModeToggle dark={dark} setDark={setDark} />

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
  onClick={() => setMenuOpen(!menuOpen)}
  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-300"
  aria-label="Toggle mobile menu"
>
  {menuOpen ? '✕' : '☰'}
</button>

          </div>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-lg z-50 p-4 space-y-4 md:hidden">
          <button
            onClick={() => setMenuOpen(false)}
            className="mb-4 text-right w-full text-gray-700 dark:text-gray-300"
          >
            ✕ Close
          </button>
          <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:underline">Home</Link>
          <Link to="/Projects" onClick={() => setMenuOpen(false)} className="block hover:underline">Projects</Link>
          <Link to="/Experience" onClick={() => setMenuOpen(false)} className="block hover:underline">Experience</Link>
          <Link to="/Education" onClick={() => setMenuOpen(false)} className="block hover:underline">Education</Link>
          <Link to="/Contact" onClick={() => setMenuOpen(false)} className="block hover:underline">Contact</Link>
          {isAuthenticated && (
            <Link to="/Admin" onClick={() => setMenuOpen(false)} className="block hover:underline">Admin</Link>
          )}
        </div>
      )}

      {/* Mobile Dark Mode Toggle */}
 <div className="md:hidden fixed bottom-4 right-4 z-50">
  <DarkModeToggle dark={dark} setDark={setDark} />
</div>

      <main className="flex-grow p-4 max-w-5xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Projects" element={<Projects />} />
          <Route path="/Experience" element={<Experience />} />
          <Route path="/Education" element={<Education />} />
          <Route path="/Contact" element={<Contact />} />
          <Route
            path="/Admin"
            element={
              isAuthenticated ? (
                <Admin
                  authHeader={authHeader}
                  setIsAuthenticated={setIsAuthenticated}
                  setUsername={setUsername}
                  setPassword={setPassword}
                />
              ) : (
                <Navigate to="/Admin-login" />
              )
            }
          />
          <Route
            path="/Admin-login"
            element={
              isAuthenticated ? (
                <Navigate to="/Admin" />
              ) : (
                <AdminLogin
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
