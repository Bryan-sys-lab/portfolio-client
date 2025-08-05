import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SectionForm from './SectionForm';
import Collapse from './Collapse';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function ExperienceSection({ authHeader }) {
  const [experience, setExperience] = useState([]);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/Experience`)
      .then(res => res.json())
      .then(setExperience);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const url = `${API_BASE}/api/Experience${editId ? `/${editId}` : ''}`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        if (editId) {
          setExperience(prev => prev.map(exp => (exp.id === editId ? data : exp)));
          toast.success('✅ Experience updated');
        } else {
          setExperience(prev => [...prev, data]);
          toast.success('✅ Experience added');
        }
        setFormData({});
        setEditId(null);
      } else {
        toast.error(data.error || '❌ Error submitting form');
      }
    } catch {
      toast.error('❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/Experience/${id}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        setExperience(prev => prev.filter(exp => exp.id !== id));
        toast.success('✅ Deleted');
      } else {
        toast.error('❌ Failed to delete');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2
        onClick={() => setOpen(!open)}
        className="text-xl font-semibold cursor-pointer mb-2 text-black dark:text-white"
      >
        Experience
      </h2>
      <Collapse isOpen={open}>
        <SectionForm
          title="Experience"
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          loading={loading}
          editId={editId}
        />
        {experience.map(exp => (
          <div
            key={exp.id}
            className="border p-3 rounded mb-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <h3 className="font-semibold">{exp.title} @ {exp.company}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{exp.start} – {exp.end || 'Present'}</p>
            <p className="dark:text-gray-200">{exp.description}</p>
            <div className="space-x-2 mt-1">
              <button
                onClick={() => {
                  setFormData(exp);
                  setEditId(exp.id);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
