import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function Education() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/Education`)
      .then((res) => res.json())
      .then((data) => {
        setEducation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading education:', err);
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
        Education
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : education.length === 0 ? (
        <p className="text-gray-500">No education entries found.</p>
      ) : (
        <div className="space-y-6">
          {education.map((edu) => (
            <motion.section
              key={edu.id}
              aria-labelledby={`edu-${edu.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border p-4 rounded dark:border-gray-700"
            >
              <h2
                id={`edu-${edu.id}`}
                className="text-xl font-semibold text-gray-800 dark:text-white"
              >
                {edu.degree}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {edu.institution} — {formatDate(edu.start)} to {formatDate(edu.end)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{edu.description}</p>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  );
}
