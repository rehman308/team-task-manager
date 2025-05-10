import api from './client';

export const fetchProjects = async () => {
  const res = await api.get('/projects');
  return res.data;
};

export const createProject = async (title) => {
  const res = await api.post('/projects', { title });
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

export const updateProject = async ({ id, title }) => {
  const res = await api.put(`/projects/${id}`, { title });
  return res.data;
};