import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFolderOpen, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [welcome, setWelcome] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/welcome`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setWelcome(data.message || 'Welcome to my portfolio!');
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching welcome message:', err);
        setError('Could not load welcome message.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative px-4 py-10 sm:py-16 text-center max-w-4xl mx-auto overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 dark:from-gray-900 to-white dark:to-gray-800" />

      {/* Animated Name */}
      <motion.h1
        className="text-4xl sm:text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8 }}
      >
        Hi, I'm <span className="text-blue-500">Brian Mwirigi</span>
      </motion.h1>

      {/* Animated Subheading */}
      <motion.p
        className="mt-2 text-xl text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        A passionate machine learning and AI engineer with a focus on building innovative solutions.
      </motion.p>

      {/* Animated Welcome Text */}
      {loading && <p className="text-gray-500 text-lg mt-6">Loading welcome message...</p>}
      {error && <p className="text-red-500 text-lg mt-6">{error}</p>}
      {!loading && !error && (
        <motion.div
          className="mt-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 flex justify-center flex-wrap"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
            hidden: {},
          }}
        >
          {welcome.split('').map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* ✅ CTA Buttons with <Link /> */}
      <motion.div
        className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <Link
          to="/projects"
          aria-label="View my projects"
          className="group w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-lg rounded shadow hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <FaFolderOpen className="group-hover:scale-110 transform transition-transform duration-300" />
          View Projects
        </Link>
        <Link
          to="/contact"
          aria-label="Contact me"
          className="group w-full sm:w-auto px-6 py-3 bg-green-600 text-white text-lg rounded shadow hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <FaEnvelope className="group-hover:scale-110 transform transition-transform duration-300" />
          Contact Me
        </Link>
      </motion.div>
    </div>
  );
}
