import React from 'react';
import { Container } from 'react-bootstrap';
import { redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Home = () => {

  return (
    <Container className="mt-5">
      <h2>Welcome to Memorify</h2>
      <p>You are logged in.</p>
    </Container>
  );
};

export default Home;
