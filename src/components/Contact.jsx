import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SocialIcons from './SocialIcons';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function Contact() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    const formData = new FormData(formRef.current);

    if (formData.get('website')) {
      setStatus('❌ Bot detected. Message not sent.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        body: formData,
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data.error = 'Invalid server response';
      }

      if (res.ok) {
        setStatus('✅ Message sent successfully!');
        formRef.current.reset();
      } else {
        setStatus(`❌ Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (err) {
      setStatus('❌ Failed to send. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Contact Me
      </h2>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-5 bg-gray-100 dark:bg-gray-800 p-6 rounded-md text-black dark:text-white"
      >
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            id="name"
            required
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            id="email"
            type="email"
            required
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="message">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            id="message"
            required
            className="w-full border border-gray-300 dark:border-gray-600 p-3 h-32 rounded bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your message..."
          ></textarea>
        </div>

        <motion.button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow-md transition disabled:opacity-50 w-full"
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </motion.button>
      </form>

      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white z-50 ${
              status.startsWith('✅') ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {status}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-3">Connect with me:</p>
        <SocialIcons />
      </div>
    </motion.div>
  );
}
