import React from 'react';

export default function SectionForm({
  title,
  formData,
  setFormData,
  handleSubmit,
  loading,
  editId,
}) {
  const fieldMap = {
    Projects: [
      { name: 'name', type: 'text', placeholder: 'Name' },
      { name: 'description', type: 'textarea', placeholder: 'Description' },
      { name: 'tech', type: 'text', placeholder: 'Tech (comma-separated)' },
      { name: 'link', type: 'text', placeholder: 'Link' },
      { name: 'image', type: 'file' },
    ],
    Experience: [
      { name: 'title', type: 'text', placeholder: 'Title' },
      { name: 'company', type: 'text', placeholder: 'Company' },
      { name: 'location', type: 'text', placeholder: 'Location' },
      { name: 'start', type: 'text', placeholder: 'YYYY-MM' },
      { name: 'end', type: 'text', placeholder: 'YYYY-MM' },
      { name: 'description', type: 'textarea', placeholder: 'Description' },
    ],
    Education: [
      { name: 'degree', type: 'text', placeholder: 'Degree' },
      { name: 'institution', type: 'text', placeholder: 'Institution' },
      { name: 'start', type: 'text', placeholder: 'YYYY-MM' },
      { name: 'end', type: 'text', placeholder: 'YYYY-MM' },
      { name: 'description', type: 'textarea', placeholder: 'Description' },
    ],
    Social: [
      { name: 'name', type: 'text', placeholder: 'Name (e.g., GitHub)' },
      { name: 'url', type: 'text', placeholder: 'URL' },
      { name: 'icon', type: 'text', placeholder: 'Icon (e.g., FaGithub)' },
    ],
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-2 mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded relative"
      encType="multipart/form-data"
    >
      {loading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 rounded">
          <span className="text-blue-600 font-semibold animate-pulse dark:text-blue-400">Loading...</span>
        </div>
      )}
      {fieldMap[title].map(({ name, type, placeholder }) =>
        type === 'textarea' ? (
          <textarea
            key={name}
            name={name}
            value={formData[name] || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, [name]: e.target.value }))}
            placeholder={placeholder}
            required
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />
        ) : type === 'file' ? (
          <input
            key={name}
            name={name}
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [name]: e.target.files[0],
              }))
            }
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900 file:cursor-pointer"
          />
        ) : (
          <input
            key={name}
            name={name}
            type={type}
            value={formData[name] || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, [name]: e.target.value }))}
            placeholder={placeholder}
            required={name !== 'end' && name !== 'icon'}
            className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-900"
          />
        )
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {editId ? 'Update' : 'Add'} {title}
      </button>
    </form>
  );
}
