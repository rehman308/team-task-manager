import api from './client';

// Fetch tasks for a project
export const fetchTasks = async (projectId) => {
  const res = await api.get(`/tasks/project/${projectId}`);
  return res.data;
};

// Add a task to a project
export const createTask = async ({ projectId, content }) => {
  const res = await api.post(`/tasks/project/${projectId}`, {
    content,
    status: 'incomplete',
  });
  return res.data;
};

// Update a task's status
export const updateTask = async ({ id, content, status }) => {
  const res = await api.put(`/tasks/${id}`, { content, status });
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};