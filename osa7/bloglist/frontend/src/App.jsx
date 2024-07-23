import { Routes, Route, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavMenu from './components/NavMenu';
import './index.css';
import BlogList from './components/BlogList';
import Notification from './components/Notification';
import Blog from './components/Blog';
import Users from './components/Users';
import User from './components/User';
import { useDispatch, useSelector } from 'react-redux';
import Login from './components/Login';
import Home from './components/Home';
import { useEffect } from 'react';
import { initializeBlogs } from './reducers/blogReducer';
import { initializeUser } from './reducers/userReducer';
import { initializeAppUsers } from './reducers/appUsersReducer';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);

  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializeBlogs());
    dispatch(initializeAppUsers());
  }, []);

  return (
    <Container>
      <NavMenu />
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path={user ? '/' : '/login'} element={<Login />} />
      </Routes>
    </Container>
  );
};

export default App;
