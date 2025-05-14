'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, createProject, deleteProject, updateProject } from '@/api/projects';
import useAuth from '@/auth/useAuth';
import useConfirmModal from '@/hooks/useConfirmModal';
import TitleBar from '@/components/TitleBar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';

export default function Projects() {
  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState(null);

  const router = useRouter();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  // Confirmation modal
  const { openModal, Modal } = useConfirmModal({
    title: 'Delete Project?',
    description: 'This will permanently delete the project and its tasks.',
    confirmText: 'Delete',
  });

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  // Create project
  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      setTitle('');
      queryClient.invalidateQueries(['projects']);
    },
  });

  // Delete project
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      setEditId(null);
      queryClient.invalidateQueries(['projects']);
    },
  });

  // Update project
  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      setEditId(null);
      queryClient.invalidateQueries(['projects']);
    },
  });

  // Add new project handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError({ addProject: 'Project title needed' });
      return;
    }
    mutation.mutate(title);
  };

  const handleNavigateProject = (project) => {
    if (project?.title) {
      setPassTitle(project.title);
    }
    if (!editId) {
      router.push(`/projects/${project.id}`);
    } else null;
  };

  if (!user) return null;

  if (isLoading) return <p className='p-4'>Loading projects...</p>;

  return (
    <>
      <TitleBar title={`${user?.name}'s Projects`} />
      <div className='p-6 max-w-3xl mx-auto'>
        {user.role === 'ADMIN' && (
          <Link
            href='/admin/users'
            className='text-blue-500 underline text-sm'>
            Manage Users
          </Link>
        )}

        {/* Create project form */}
        <form
          onSubmit={handleSubmit}
          className='mb-6 flex gap-2'>
          <input
            type='text'
            value={title}
            onChange={(e) => {
              setError(null);
              setTitle(e.target.value);
            }}
            placeholder='New project title'
            className='flex-1 border p-2 rounded'
          />
          <Button
            label='Add'
            color='bg-green-500'
            hoverColor='bg-green-700'
            type='submit'
          />
        </form>

        {error?.addProject && <p className='text-amber-600 mb-4 text-center'>{error.addProject}</p>}

        {/* List of current user projects */}
        <div className='grid gap-4'>
          {projects.length === 0 && <p>No projects found.</p>}
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleNavigateProject(project)}
              className='p-4 border rounded shadow hover:bg-gray-300 hover:cursor-pointer'>
              {editId === project.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!editTitle.trim()) {
                      setError({ editProject: 'Project title needed' });
                      return;
                    }
                    updateMutation.mutate({
                      id: project.id,
                      title: editTitle,
                    });
                  }}
                  className='flex gap-2 mb-2'>
                  <input
                    className='flex-1 border p-2 rounded'
                    value={editTitle}
                    onChange={(e) => {
                      setError(null);
                      setEditTitle(e.target.value);
                    }}
                  />

                  <Button
                    label='Save'
                    color='bg-green-500'
                    hoverColor='bg-green-700'
                    onClick={(e) => e.stopPropagation()}
                  />

                  <Button
                    label='Cancel'
                    color='bg-amber-500'
                    hoverColor='bg-amber-700'
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditId(null);
                    }}
                  />
                </form>
              ) : (
                <div className='flex justify-between items-center'>
                  <p className='text-lg font-semibold'>{project.title}</p>
                  <div className='flex gap-2 text-sm'>
                    <Button
                      label='Edit'
                      color='bg-blue-500'
                      hoverColor='bg-blue-700'
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditId(project.id);
                        setEditTitle(project.title);
                      }}
                    />

                    <Button
                      label='Delete'
                      color='bg-red-500'
                      hoverColor='bg-red-700'
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(project.id, deleteMutation.mutate);
                      }}
                    />
                  </div>
                </div>
              )}

              <p className='text-sm text-gray-500'>
                {project.tasks.length} task
                {project.tasks.length !== 1 ? 's' : ''}
              </p>

              {error?.editProject && editId === project.id && <p className='text-amber-600 text-center'>{error.editProject}</p>}
            </div>
          ))}
        </div>

        {/* modal for confirming deletions */}
        {Modal}
      </div>
      <Footer />
    </>
  );
}
