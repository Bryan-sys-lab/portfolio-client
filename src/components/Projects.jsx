import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const FILE_BASE = API_BASE || window.location.origin;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x400?text=No+Image';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/Projects`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Projects data is not an array');
        }

        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setError('Failed to load projects.');
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        My Projects
      </h1>

      {loading && <p className="text-center text-gray-500">Loading projects...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && projects.length === 0 && (
        <p className="text-center text-gray-500">No projects to show.</p>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {Array.isArray(projects) && projects.map((project) => {
            const isOpen = expandedId === project.id;
            const techList = Array.isArray(project.tech) ? project.tech.join(', ') : project.tech;

            return (
              <motion.div
                key={project.id}
                layout
                className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  onClick={() => toggleExpand(project.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {project.name}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {isOpen ? '▲ Collapse' : '▼ Expand'}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="px-4 pb-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {project.description}
                      </p>

                      <img
                        src={project.image || PLACEHOLDER_IMAGE}
                        alt={project.name}
                        className="w-full max-h-64 object-cover rounded mb-4 border"
                      />

                      {project.files && project.files.length > 0 && (
                        <div className="mb-4">
                          <strong className="text-sm text-gray-500 dark:text-gray-400">Files:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {project.files.map((file, idx) => (
                              <li key={idx}>
                                <a
                                  href={`${FILE_BASE}${file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 text-sm"
                                >
                                  {file.split('/').pop()}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <strong>Tech:</strong> {techList}
                      </p>

                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open project"
                          className="inline-block mt-2 text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          Visit Project
                        </a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
