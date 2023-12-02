import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Import the Axios instance
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('auth/login', { email, password });
      console.log('response: ', response);
      if (response.data?.token) {
        // Save the authentication token to localStorage
        // localStorage.setItem('authToken', response.data.token);

        const userData = {
          email,
          userId: response.data.userId,
          firstName: response.data.firstName,
        };
        // Call the login function from AuthContext to set the authenticated state.
        login(userData, response.data.token);
        // Redirect to the home page or wherever you want to go after successful login.
        navigate('/');
      } else {
        // Handle authentication failure, show an error message, etc.
        setError('Invalid username or password');
      }
    } catch (error) {
      // Handle network errors, server errors, etc.
      console.error('Error during login:', error.message);
      setError('Error during login. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </Form>

      <p className="mt-3">
        Don't have an account? <a href="/register">Register here</a>.
      </p>
    </Container>
  );
};

export default Login;
