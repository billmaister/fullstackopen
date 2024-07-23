import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/userReducer';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(login(username, password));
    navigate('/');
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            placeholder="Enter username"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Enter password"
          />
        </Form.Group>

        <Button variant="primary" type="submit" id="login-button">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
