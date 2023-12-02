import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom'; // Update import
import NavigationBar from './components/NavigationBar/NavigationBar';
import Login from './components/Login/Login';
import Home from './pages/Home/Home';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Registration from './pages/Registration/Registration';

const App = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <NavigationBar />
      <Container className="mt-5">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
