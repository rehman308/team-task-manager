import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { useState } from 'react';
import useConfirmModal from '../hooks/useConfirmModal';
import TitleBar from '../components/TitleBar';
import Footer from '../components/Footer';
import Button from '../components/Button';

export default function ProjectDetail() {
  const { id: projectId } = useParams();
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [Error, setError] = useState(null);
  const queryClient = useQueryClient();

  const { openModal: openTaskDeleteModal, Modal: TaskDeleteModal } = useConfirmModal({
    title: 'Delete Task?',
    description: 'Are you sure you want to delete this task?',
    confirmText: 'Delete',
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchTasks(projectId),
  });

  const addMutation = useMutation({
    mutationFn: ({ content }) => createTask({ projectId, content }),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries(['tasks', projectId]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', projectId]);
      setEditId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries(['tasks', projectId]),
  });

  const toggleStatus = (task) => {
    updateMutation.mutate({
      id: task.id,
      content: task.content,
      status: task.status === 'complete' ? 'incomplete' : 'complete',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError({ newTask: 'Task title needed' });
      return;
    }
    addMutation.mutate({ content });
  };

  if (isLoading) return <p className='p-4'>Loading tasks...</p>;

  return (
    <>
      <TitleBar title={`Tasks`} />
      <div className='p-3 max-w-3xl mx-auto'>
        <Button
          label={'Back to Projects'}
          color={'bg-blue-500'}
          hoverColor={'bg-blue-500'}
          onClick={() => window.history.back()}
        />
        <form
          onSubmit={handleSubmit}
          className='mt-4 mb-6 flex gap-2'>
          <input
            type='text'
            placeholder='New task'
            value={content}
            onChange={(e) => {
              setError(null);
              setContent(e.target.value);
            }}
            className='flex-1 border p-2 rounded'
          />

          <Button
            label={'Add Task'}
            color={'bg-green-500'}
            hoverColor={'bg-green-700'}
            type={'submit'}
          />
        </form>
        {/*show error if new task title is empty*/}
        {Error?.newTask && <p className='mb-3 text-amber-600 text-center'>{Error.newTask}</p>}

        <ul className='space-y-3'>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`p-3 rounded shadow-md  border flex justify-between items-center ${
                task.status === 'complete' ? 'bg-green-100' : 'bg-white'
              }`}>
              <div className='flex-1'>
                {editId === task.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!editContent.trim()) {
                        setError({ editTask: 'Task title needed' });
                        return;
                      }
                      updateMutation.mutate({
                        id: task.id,
                        content: editContent,
                        status: task.status,
                      });
                    }}
                    className='flex gap-2'>
                    <input
                      className='border p-1 flex-1 rounded'
                      value={editContent}
                      onChange={(e) => {
                        setError(null);
                        setEditContent(e.target.value);
                      }}
                    />

                    <Button
                      label={'Save'}
                      color={'bg-green-500'}
                      hoverColor={'bg-green-700'}
                      type='submit'
                    />

                    <Button
                      label={'Cancel'}
                      color={'bg-amber-500'}
                      hoverColor={'bg-amber-700'}
                      type='button'
                      onClick={() => setEditId(null)}
                    />
                  </form>
                ) : (
                  <span
                    className={`cursor-pointer block ${task.status === 'complete' ? 'line-through text-gray-500' : ''}`}
                    onClick={() => toggleStatus(task)}>
                    {task.content}
                  </span>
                )}
                {/*show error if edited task title is empty*/}
                {Error?.editTask && editId === task.id && <p className='mt-2 text-amber-600 text-center'>{Error.editTask}</p>}
              </div>
              {!editId && (
                <div className='flex gap-2 items-center'>
                  <button
                    onClick={() => toggleStatus(task)}
                    className={`text-md px-2 py-1 rounded ${
                      task.status === 'complete' ? 'bg-green-200 text-green-700 border' : 'bg-yellow-200 text-yellow-700'
                    }`}>
                    {task.status === 'complete' ? 'Complete' : 'Incomplete'}
                  </button>

                  <Button
                    label={'Edit'}
                    color={'bg-blue-500'}
                    hoverColor={'bg-blue-700'}
                    onClick={() => {
                      setEditId(task.id);
                      setEditContent(task.content);
                    }}
                  />

                  <Button
                    label={'Delete'}
                    color={'bg-red-500'}
                    hoverColor={'bg-red-700'}
                    onClick={() => openTaskDeleteModal(task.id, deleteMutation.mutate)}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
        {TaskDeleteModal}
      </div>
      <Footer />
    </>
  );
}
