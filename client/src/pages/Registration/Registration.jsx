import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const Registration = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  if (user) {
    return <Navigate to={'/'} replace={true} />;
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthday: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the registration function from your authentication context
    // Make sure the register function handles the registration logic
    try {
      const response = await api.post('auth/register', formData);
      console.log(response);
      if (response.statusText === 'Created' && response.data.token) {
        // localStorage.setItem('authToken', response.data.token);
        const userData = {
          email: formData.email,
          userId: response.data.userId,
          firstName: formData.firstName,
        };
        login(userData, response.data.token);
        // Redirect to the home page or any other desired page after successful registration
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response && error.response.data.message) {
        // User already exists with this email, display the error message
        setError(error.response.data.message);
      } else {
        // Handle other unexpected errors
        setError('Unexpected registration error. Please try again later.');
      }
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your first name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="birthday">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-2">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Registration;
