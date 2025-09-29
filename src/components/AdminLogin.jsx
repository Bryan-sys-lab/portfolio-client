import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AdminLogin({
  username, setUsername,
  password, setPassword,
  setIsAuthenticated
}) {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authHeader = 'Basic ' + btoa(username + ':' + password);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/auth-check`, {
        method: 'GET',
        headers: { Authorization: authHeader },
      });

      if (res.status === 401) {
        setError('Invalid credentials.');
      } else if (res.ok) {
        setIsAuthenticated(true);
        navigate('/Admin');
      } else {
        setError('Unexpected error.');
      }
    } catch {
      setError('Server error.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-800"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
