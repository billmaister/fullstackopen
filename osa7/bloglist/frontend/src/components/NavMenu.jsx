import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/userReducer';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const NavMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Blog app</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/blogs">
              <Nav.Link>Blogs</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/users">
              <Nav.Link>Users</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Item className="text-light me-2">{user.name} logged in</Nav.Item>
                <Button variant="outline-light" onClick={() => dispatch(logout())}>
                  Logout
                </Button>
              </>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;
