import { useNavigate } from 'react-router-dom';
import Button from './Button';
import useAuth from '../auth/useAuth';

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='max-w-7xl mx-auto p-4 flex justify-between items-center mb-6 bg-gray-600'>
      <h1 className='text-2xl font-bold text-white'>{title}</h1>

      <Button
        label='Logout'
        color='bg-violet-500'
        hoverColor='bg-violet-600'
        onClick={handleLogout}
      />
    </div>
  );
}
