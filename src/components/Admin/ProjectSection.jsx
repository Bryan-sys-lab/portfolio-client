import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import Collapse from './Collapse';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function ProjectSection({ authHeader }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/Projects`)
      .then(res => res.json())
      .then(setProjects);
  }, []);

  const resetForm = () => {
    setForm({});
    setEditId(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const method = editId ? 'PUT' : 'POST';
    const endpoint = `${API_BASE}/api/Projects${editId ? `/${editId}` : ''}`;

    // Convert tech to array if it's a string
    const processedForm = {
      ...form,
      tech: typeof form.tech === 'string'
        ? form.tech.split(',').map(t => t.trim())
        : form.tech,
    };

    const formData = new FormData();
    Object.entries(processedForm).forEach(([key, value]) => {
      if (key === 'files') {
        value.forEach(file => formData.append('files', file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { Authorization: authHeader },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setProjects(prev =>
          editId ? prev.map(p => (p.id === editId ? { ...p, ...data } : p)) : [...prev, data]
        );
        toast.success(`✅ Project ${editId ? 'updated' : 'added'}`);
        resetForm();
      } else {
        toast.error(`❌ Failed: ${data.error || 'Unknown error'}`);
      }
    } catch {
      toast.error('❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/Projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        toast.success('✅ Deleted');
      } else {
        toast.error('❌ Could not delete');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2
        onClick={() => setOpen(o => !o)}
        className="text-xl font-semibold mb-2 cursor-pointer text-black dark:text-white"
      >
        Projects
      </h2>
      <Collapse isOpen={open}>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-2 mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded relative"
          encType="multipart/form-data"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded">
              <span className="text-blue-600 animate-pulse dark:text-blue-400">Processing...</span>
            </div>
          )}

          <input
            type="text"
            placeholder="Name"
            required
            value={form.name || ''}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />

          <textarea
            placeholder="Description"
            required
            value={form.description || ''}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />

          <input
            type="text"
            placeholder="Tech (comma separated)"
            required
            value={form.tech || ''}
            onChange={e => setForm(prev => ({ ...prev, tech: e.target.value }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />

          <input
            type="text"
            placeholder="Link"
            value={form.link || ''}
            onChange={e => setForm(prev => ({ ...prev, link: e.target.value }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />

          <input
            type="text"
            placeholder="GitHub Link"
            value={form.github_link || ''}
            onChange={e => setForm(prev => ({ ...prev, github_link: e.target.value }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />

          <input
            type="file"
            accept="image/*"
            onChange={e => setForm(prev => ({ ...prev, image: e.target.files[0] }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />

          {editId && form.files && form.files.length > 0 && (
            <div className="mb-2">
              <strong className="text-sm text-gray-700 dark:text-gray-300">Current Files:</strong>
              <ul className="list-disc list-inside mt-1">
                {form.files.map((file, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                    {typeof file === 'string' ? file.split('/').pop() : file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <input
            type="file"
            multiple
            onChange={e => setForm(prev => ({ ...prev, files: Array.from(e.target.files) }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editId ? 'Update' : 'Add'} Project
          </button>
        </form>

        {projects.map(p => (
          <div
            key={p.id}
            className="border p-3 rounded mb-2 bg-white dark:bg-gray-900 text-black dark:text-white"
          >
            <h3 className="font-bold">{p.name}</h3>
            <div className="text-sm"><ReactMarkdown>{p.description}</ReactMarkdown></div>
            {p.image && (
              <img
                src={p.image}
                alt="Project"
                className="max-h-40 mt-2 rounded"
              />
            )}
            {p.files && p.files.length > 0 && (
              <div className="mt-2">
                <strong>Files:</strong>
                <ul className="list-disc list-inside">
                  {p.files.map((file, idx) => (
                    <li key={idx}>
                      <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {file.split('/').pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Tech: {Array.isArray(p.tech) ? p.tech.join(', ') : p.tech}
            </div>
            {p.link && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Link: <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{p.link}</a>
              </div>
            )}
            {p.github_link && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                GitHub: <a href={p.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{p.github_link}</a>
              </div>
            )}
            <div className="space-x-2 mt-2">
              <button
                onClick={() => {
                  setForm({
                    ...p,
                    tech: Array.isArray(p.tech) ? p.tech.join(', ') : p.tech
                  });
                  setEditId(p.id);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </Collapse>
    </section>
  );
}
