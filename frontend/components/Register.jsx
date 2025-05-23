'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/api/client';
import useAuth from '@/auth/useAuth';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const router = useRouter();
  const login = useAuth((s) => s.login);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    let isValid = true;
    let errorMessages = {
      name: '',
      email: '',
      password: '',
    };

    if (!form.name) {
      errorMessages.name = 'Name is required';
      isValid = false;
    }

    if (!form.email) {
      errorMessages.email = 'Email is required';
      isValid = false;
    }

    if (!form.password) {
      errorMessages.password = 'Password is required';
      isValid = false;
    }

    setErrors(errorMessages);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      router.push('/projects');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded shadow-md w-80'>
        <h2 className='text-xl mb-4 text-center'>Register</h2>

        <input
          name='name'
          type='text'
          placeholder='Name'
          value={form.name}
          onChange={handleChange}
          className='w-full mb-3 border p-2'
        />
        {errors.name && <p className='text-red-500 text-sm mb-2'>{errors.name}</p>}

        <input
          name='email'
          type='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          className='w-full mb-3 border p-2'
        />
        {errors.email && <p className='text-red-500 text-sm mb-2'>{errors.email}</p>}

        <input
          name='password'
          type='password'
          placeholder='Password'
          value={form.password}
          onChange={handleChange}
          className='w-full mb-3 border p-2'
        />
        {errors.password && <p className='text-red-500 text-sm mb-2'>{errors.password}</p>}

        <button
          type='submit'
          className='w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 hover:cursor-pointer'>
          Register
        </button>

        <p className='mt-4 text-sm text-center'>
          Already have an account?
          <Link
            href='/login'
            className='px-2 text-blue-500 hover:underline'>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
