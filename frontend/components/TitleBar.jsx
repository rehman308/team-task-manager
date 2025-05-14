'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import Button from './Button';
import useAuth from '../auth/useAuth';

export default function TitleBar({title}) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const defaultTitle = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) return 'Dashboard';

    return segments.map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1)).join(' / ');
  }, [pathname]);

  const maketitle = () => {
    const regex = /^\/project\/\d+$/;
    if (regex.test(pathname)) {
      return projectTitle;
    } else {
      return defaultTitle;
    }
  };

  return (
    <div className='max-w-7xl mx-auto p-4 flex justify-between items-center mb-6 bg-gray-600'>
      <div>
        <h1 className='text-2xl font-bold text-white'>{title ? title : 'Project Manager'}</h1>
        {user && <p className='text-sm text-white mt-1'>Welcome, {user.name}</p>}
      </div>

      <Button
        label='Logout'
        color='bg-violet-500'
        hoverColor='bg-violet-600'
        onClick={handleLogout}
      />
    </div>
  );
}
