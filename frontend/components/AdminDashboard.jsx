'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/api/users';
import { useRouter } from 'next/navigation';
import useAuth from '@/auth/useAuth';
import { useState } from 'react';
import useConfirmModal from '@/hooks/useConfirmModal';
import Button from '@/components/Button';
import TitleBar from '@/components/TitleBar';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const { openModal: openUserDeleteModal, Modal: UserDeleteModal } = useConfirmModal({
    title: 'Delete User?',
    description: 'This will permanently delete the user and all their projects and tasks.',
    confirmText: 'Delete',
  });

  const { logout, user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [editUserId, setEditUserId] = useState(null);
  const [formError, setFormError] = useState({ status: false });

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const isFormValid = ({ name, email, password, role }) => {
    const errors = {};

    if (name.length < 5 || name.length > 25) {
      errors.name = 'Username must be between 5 and 25 characters';
    }

    if (!email.includes('@')) {
      errors.email = 'Invalid email address';
    }

    if (password.length < 6 || password.length > 12) {
      errors.password = 'Password must be between 6 and 12 characters';
    }

    if (errors.name || errors.email || errors.password) {
      setFormError({ ...errors, status: true });
    } else {
      setFormError({ status: false });
    }
  };

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setForm({ name: '', email: '', password: '', role: 'MEMBER' });
      queryClient.invalidateQueries(['users']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      setEditUserId(null);
      setForm({ name: '', email: '', password: '', role: 'MEMBER' });
      queryClient.invalidateQueries(['users']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  if (!user || user.role !== 'ADMIN') {
    router.push('/projects');
    return null;
  }

  if (isLoading) return <p className='p-4'>Loading users...</p>;

  return (
    <>
      <TitleBar title='User Management (Admin)' />
      <div className='min-h-screen max-w-6xl mx-auto flex flex-col'>
        <h2 className='text-xl font-semibold mb-2'>Add / Edit User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            isFormValid(form);
            if (!formError.status) {
              editUserId ? updateMutation.mutate({ id: editUserId, ...form }) : createMutation.mutate(form);
            }
          }}
          className='mb-6 flex flex-wrap gap-2 items-center'>
          <input
            type='text'
            placeholder='Name'
            value={form.name}
            onChange={(e) =>
              setForm((f) => {
                setFormError({});
                return { ...f, name: e.target.value };
              })
            }
            className='p-2 border rounded flex-1'
          />

          <input
            type='email'
            placeholder='Email'
            value={form.email}
            onChange={(e) =>
              setForm((f) => {
                setFormError({});
                return { ...f, email: e.target.value };
              })
            }
            className='p-2 border rounded flex-1'
          />

          <input
            type='password'
            placeholder='Password'
            value={form.password}
            onChange={(e) =>
              setForm((f) => {
                setFormError({});
                return { ...f, password: e.target.value };
              })
            }
            className='p-2 border rounded flex-1'
          />

          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className='p-2 border rounded'>
            <option value='MEMBER'>MEMBER</option>
            <option value='ADMIN'>ADMIN</option>
          </select>

          <Button
            label={editUserId ? 'Update' : 'Create'}
            color='bg-green-600'
            hoverColor='bg-green-700'
          />

          {editUserId && (
            <Button
              label='Cancel'
              color='bg-orange-400'
              hoverColor='bg-orange-500'
              onClick={() => {
                setEditUserId(null);
                setFormError({});
                setForm({ name: '', email: '', password: '', role: 'MEMBER' });
              }}
            />
          )}
        </form>

        <div className='mb-4 text-amber-700 text-center'>
          {formError.name && <p>{formError.name}</p>}
          {formError.email && <p>{formError.email}</p>}
          {formError.password && <p>{formError.password}</p>}
        </div>

        <table className='w-full table-auto border'>
          <thead>
            <tr className='bg-gray-100 text-center'>
              <th className='p-2 border'>ID</th>
              <th className='p-2 border'>Name</th>
              <th className='p-2 border'>Email</th>
              <th className='p-2 border'>Role</th>
              <th className='p-2 border'>Projects</th>
              <th className='p-2 border'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className='hover:bg-gray-200 cursor-pointer'
                onClick={user.id !== u.id ? () => router.push(`/admin/users/${u.id}/projects`) : null}>
                <td className='p-2 border text-center'>{u.id}</td>
                <td className='p-2 border'>{u.name}</td>
                <td className='p-2 border'>{u.email}</td>
                <td className='p-2 border text-center'>{u.role}</td>
                <td className='p-2 border text-center'>{u._count.projects}</td>
                <td className='p-2 border-b-1 flex justify-evenly'>
                  <Button
                    label='Edit'
                    color='bg-blue-500'
                    hoverColor='bg-blue-700'
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditUserId(u.id);
                      setForm({ name: u.name, email: u.email, password: '', role: u.role });
                    }}
                  />
                  {user.id !== u.id && (
                    <Button
                      label='Delete'
                      color='bg-red-500'
                      hoverColor='bg-red-600'
                      onClick={(e) => {
                        e.stopPropagation();
                        openUserDeleteModal(u.id, deleteMutation.mutate);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {UserDeleteModal}
      </div>
      <Footer />
    </>
  );
}
