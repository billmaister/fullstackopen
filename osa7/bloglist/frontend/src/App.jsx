import { useState, useEffect } from "react";
import Login from "./components/Login";
import AddNewBlog from "./components/AddNewBlog";
import Notification from "./components/Notification";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import BlogList from "./components/BlogList";
import { initializeUser, logout } from "./reducers/userReducer";

const App = () => {
  const [showAddBlog, setShowAddBlog] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUser());
    setShowAddBlog(false);
  }, []);

  useEffect(() => {
    setShowAddBlog(false);
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <div>
          <Login />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <div>
        Logged in as {user.name} <button onClick={handleLogout}>Log out</button>
      </div>
      {!showAddBlog && (
        <button id="add-blog-button" onClick={() => setShowAddBlog(true)}>
          Add new blog
        </button>
      )}
      {showAddBlog && <AddNewBlog setShowAddBlog={setShowAddBlog} />}
      <BlogList />
    </div>
  );
};

export default App;
