import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import useAuth from './auth/useAuth';
import AdminUsers from './pages/AdminUsers';
import AdminUserProjects from './pages/AdminUserProjects';

function App() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />
        {token ? (
          <>
            <Route
              path='/admin/users'
              element={<AdminUsers />}
            />

            <Route
              path='/admin/users/:id/projects'
              element={<AdminUserProjects />}
            />

            <Route
              path='/projects'
              element={<Projects />}
            />
            <Route
              path='/projects/:id'
              element={<ProjectDetail />}
            />
            <Route
              path='*'
              element={<Navigate to='/projects' />}
            />
          </>
        ) : (
          <Route
            path='*'
            element={<Navigate to='/login' />}
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
