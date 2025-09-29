import ProjectSection from './Admin/ProjectSection';
import ExperienceSection from './Admin/ExperienceSection';
import EducationSection from './Admin/EducationSection';
import SocialSection from './Admin/SocialSection';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Admin({ authHeader, setIsAuthenticated, setUsername, setPassword }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Logout?')) {
      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
      toast.success('Logged out');
      navigate('/Admin-login');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <ProjectSection authHeader={authHeader} />
      <ExperienceSection authHeader={authHeader} />
      <EducationSection authHeader={authHeader} />
      <SocialSection authHeader={authHeader} />
    </div>
  );
}
