import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Collapse from './Collapse';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function AboutSection({ authHeader }) {
  const [abouts, setAbouts] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/About`)
      .then(res => res.json())
      .then(setAbouts);
  }, []);

  const resetForm = () => {
    setForm({});
    setEditId(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const method = editId ? 'PUT' : 'POST';
    const endpoint = `${API_BASE}/api/About${editId ? `/${editId}` : ''}`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setAbouts(prev =>
          editId ? prev.map(a => (a.id === editId ? { ...a, ...form } : a)) : [...prev, data]
        );
        toast.success(`✅ About ${editId ? 'updated' : 'added'}`);
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
    if (!confirm('Delete this about item?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/About/${id}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        setAbouts(prev => prev.filter(a => a.id !== id));
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
        About
      </h2>
      <Collapse isOpen={open}>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-2 mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded relative"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded">
              <span className="text-blue-600 animate-pulse dark:text-blue-400">Processing...</span>
            </div>
          )}

          <input
            type="text"
            placeholder="Title"
            required
            value={form.title || ''}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />

          <input
            type="text"
            placeholder="Icon (e.g., Code2, Database)"
            value={form.icon || ''}
            onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />

          <input
            type="text"
            placeholder="Category (e.g., Professional, Personal Values)"
            value={form.category || ''}
            onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />

          <textarea
            placeholder="Content"
            required
            value={form.content || ''}
            onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
            rows="4"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editId ? 'Update' : 'Add'} About
          </button>
        </form>

        {abouts.map(a => (
          <div
            key={a.id}
            className="border p-3 rounded mb-2 bg-white dark:bg-gray-900 text-black dark:text-white"
          >
            <h3 className="font-bold">{a.title}</h3>
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: a.content }} />
            <div className="space-x-2 mt-2">
              <button
                onClick={() => {
                  setForm(a);
                  setEditId(a.id);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(a.id)}
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