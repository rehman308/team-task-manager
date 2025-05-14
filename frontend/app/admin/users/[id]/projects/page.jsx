'use client';

import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

import api from '@/api/client';
import { updateProject, deleteProject, createProject } from '@/api/projects';
import { updateTask, deleteTask, createTask } from '@/api/tasks';

import ConfirmModal from '@/components/ConfirmModal';
import Button from '@/components/Button';
import AdminUserTask from '@/components/AdminUserTask';
import AdminUserProjectEdit from '@/components/AdminUserProjectEdit';
import TitleBar from '@/components/TitleBar';
import Footer from '@/components/Footer';

export default function AdminUserProjectsPage() {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectTitle, setEditProjectTitle] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [taskEdits, setTaskEdits] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newTaskContent, setNewTaskContent] = useState('');
  const [projectTitleError, setProjectTitleError] = useState('');
  const [taskTitleError, setTaskTitleError] = useState('');

  useEffect(() => {
    if (!id) return;
  }, [id]);

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      setEditProjectId(null);
      queryClient.invalidateQueries(['admin-user-projects', id]);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-user-projects', id]);
      setSelectedProjectId(null);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => queryClient.invalidateQueries(['admin-user-projects', id]),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries(['admin-user-projects', id]),
  });

  const createProjectMutation = useMutation({
    mutationFn: async (title) => {
      const res = await api.post('/projects', { title, userId: +id });
      return res.data;
    },
    onSuccess: () => {
      setNewProjectTitle('');
      queryClient.invalidateQueries(['admin-user-projects', id]);
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async ({ projectId, content }) => {
      const res = await createTask({ projectId, content });
      return res.data;
    },
    onSuccess: () => {
      setNewTaskContent('');
      queryClient.invalidateQueries(['admin-user-projects', id]);
    },
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-user-projects', id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}/projects`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: userName, isLoading: isUserNameLoading } = useQuery({
    queryKey: ['admin-user-name', id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}/name`);
      return res.data;
    },
    enabled: !!id,
  });

  const handleNewProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) {
      setProjectTitleError('Project title is required.');
      return;
    }
    setProjectTitleError('');
    createProjectMutation.mutate(newProjectTitle);
  };

  const handleNewTaskSubmit = (e, projectId) => {
    e.preventDefault();
    if (!newTaskContent.trim()) {
      setTaskTitleError('Task title is required.');
      return;
    }
    setTaskTitleError('');
    createTaskMutation.mutate({ projectId, content: newTaskContent });
  };

  if (!id) return <p>Loading...</p>;

  return (
    <>
      <TitleBar title='User Management (Admin)' />
      <div className='min-h-screen max-w-6xl mx-auto flex flex-col'>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold mb-4'>{userName} Projects</h1>
          <Link
            href='/admin/users'
            className='px-4 py-2 text-white mb-4 rounded bg-blue-500'>
            Back to Users
          </Link>
        </div>

        {/* New Project Form */}
        <form
          className='mb-4 flex gap-2 items-center'
          onSubmit={handleNewProjectSubmit}>
          <input
            type='text'
            placeholder='New Project Title'
            className='border px-2 py-2 rounded flex-1'
            value={newProjectTitle}
            onChange={(e) => {
              setProjectTitleError('');
              setNewProjectTitle(e.target.value);
            }}
          />
          <Button
            label='Add Project'
            color='bg-green-600'
            hoverColor='bg-green-700'
            type='submit'
          />
        </form>
        {projectTitleError && <p className='mb-3 text-amber-600 text-center'>{projectTitleError}</p>}

        {isLoading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul className='space-y-4'>
            {projects.map((project) => (
              <div
                key={project.id}
                className='border p-4 rounded shadow'>
                {editProjectId === project.id ? (
                  <AdminUserProjectEdit
                    project={project}
                    editProjectTitle={editProjectTitle}
                    setEditProjectTitle={setEditProjectTitle}
                    updateProjectMutation={updateProjectMutation}
                    setEditProjectId={setEditProjectId}
                  />
                ) : (
                  <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-lg font-semibold'>{project.title}</h2>
                    <div className='text-sm flex gap-3'>
                      <Button
                        label='Edit'
                        color='bg-blue-500'
                        hoverColor='bg-blue-700'
                        onClick={() => {
                          setEditProjectId(project.id);
                          setEditProjectTitle(project.title);
                        }}
                      />
                      <Button
                        label='Delete'
                        color='bg-red-500'
                        hoverColor='bg-red-700'
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          setShowModal(true);
                        }}
                      />
                      <Button
                        label={expandedProjectId === project.id ? 'Hide Tasks' : 'Show Tasks'}
                        color='bg-teal-500'
                        hoverColor='bg-teal-700'
                        onClick={() => setExpandedProjectId(expandedProjectId === project.id ? null : project.id)}
                      />
                    </div>
                  </div>
                )}

                {expandedProjectId === project.id && (
                  <>
                    <form
                      className='mt-4 flex gap-2 items-center'
                      onSubmit={(e) => handleNewTaskSubmit(e, project.id)}>
                      <input
                        type='text'
                        placeholder='New Task Content'
                        className='border px-2 py-2 rounded flex-1'
                        value={newTaskContent}
                        onChange={(e) => {
                          setTaskTitleError('');
                          setNewTaskContent(e.target.value);
                        }}
                      />
                      <Button
                        label='Add Task'
                        color='bg-green-600'
                        hoverColor='bg-green-700'
                        type='submit'
                      />
                    </form>
                    {taskTitleError && <p className='mt-2 text-amber-600 text-center'>{taskTitleError}</p>}
                    <AdminUserTask
                      project={project}
                      taskEdits={taskEdits}
                      setTaskEdits={setTaskEdits}
                      updateTaskMutation={updateTaskMutation}
                      deleteTaskMutation={deleteTaskMutation}
                    />
                  </>
                )}
              </div>
            ))}
          </ul>
        )}

        <ConfirmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            if (selectedProjectId) {
              deleteProjectMutation.mutate(selectedProjectId);
            }
          }}
          title='Delete Project?'
          description='This will permanently delete the project and its tasks.'
          confirmText='Delete'
          cancelText='Cancel'
        />
      </div>
      <Footer />
    </>
  );
}
