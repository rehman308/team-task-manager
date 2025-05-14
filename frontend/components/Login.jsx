'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/api/client';
import useAuth from '@/auth/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuth((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'ADMIN') {
        router.push('/admin/users');
      } else {
        router.push('/projects');
      }
    } catch (err) {
      setError('Incorrect Email or Password');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded shadow-md w-80'>
        <h2 className='text-2xl mb-3 text-center'>Team Task Management</h2>
        <p className='text-xl mb-2 text-center uppercase tracking-widest'>Login</p>
        <input
          type='email'
          className='w-full mb-3 border p-2'
          placeholder='Email'
          value={email}
          onChange={(e) => {
            setError('');
            setEmail(e.target.value);
          }}
        />
        <input
          type='password'
          className='w-full mb-3 border p-2'
          placeholder='Password'
          value={password}
          onChange={(e) => {
            setError('');
            setPassword(e.target.value);
          }}
        />
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded hover:cursor-pointer hover:bg-blue-700'>
          Login
        </button>

        {error && <p className='mt-2 text-red-400 text-center'>{error}</p>}

        <p className='mt-4 text-sm text-center'>
          Don&apos;t have an account?
          <Link
            href='/register'
            className='text-blue-500 px-2 hover:underline'>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
