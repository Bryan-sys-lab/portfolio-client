import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/Experience`)
      .then((res) => res.json())
      .then((data) => {
        setExperience(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading experience:', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        Experience
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : experience.length === 0 ? (
        <p className="text-gray-500">No experience entries found.</p>
      ) : (
        <div className="space-y-6">
          {experience.map((exp) => (
            <motion.section
              key={exp.id}
              aria-labelledby={`exp-${exp.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border p-4 rounded dark:border-gray-700"
            >
              <h2
                id={`exp-${exp.id}`}
                className="text-xl font-semibold text-gray-800 dark:text-white"
              >
                {exp.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {exp.company} — {formatDate(exp.start)} to {formatDate(exp.end)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  );
}
