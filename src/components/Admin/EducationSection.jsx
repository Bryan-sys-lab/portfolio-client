import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SectionForm from './SectionForm';
import Collapse from './Collapse';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function EducationSection({ authHeader }) {
  const [education, setEducation] = useState([]);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/Education`)
      .then(res => res.json())
      .then(setEducation);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const url = `${API_BASE}/api/Education${editId ? `/${editId}` : ''}`;
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
          setEducation(prev => prev.map(e => (e.id === editId ? data : e)));
          toast.success('✅ Education updated');
        } else {
          setEducation(prev => [...prev, data]);
          toast.success('✅ Education added');
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
    if (!confirm('Delete this education?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/Education/${id}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        setEducation(prev => prev.filter(e => e.id !== id));
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
        Education
      </h2>
      <Collapse isOpen={open}>
        <SectionForm
          title="Education"
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          loading={loading}
          editId={editId}
        />
        {education.map(e => (
          <div
            key={e.id}
            className="border p-3 rounded mb-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <h3 className="font-semibold">
              {e.degree} @ {e.institution}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {e.start} – {e.end || 'Present'}
            </p>
            <p className="dark:text-gray-200">{e.description}</p>
            <div className="space-x-2 mt-1">
              <button
                onClick={() => {
                  setFormData(e);
                  setEditId(e.id);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(e.id)}
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
