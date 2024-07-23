import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBlog } from '../reducers/blogReducer';
import { Form, Button, Container } from 'react-bootstrap';

const AddNewBlog = () => {
  const [blog, setBlog] = useState({
    title: '',
    author: '',
    url: '',
  });

  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(createBlog(blog));
    emptyBlogInput();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  const emptyBlogInput = () => {
    setBlog({
      title: '',
      author: '',
      url: '',
    });
  };

  return (
    <Container>
      <h2 className="mt-4 mb-3">Add New Blog</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={blog.title}
            name="title"
            onChange={handleInputChange}
            placeholder="Blog title"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={blog.author}
            name="author"
            onChange={handleInputChange}
            placeholder="Blog author"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUrl">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            value={blog.url}
            name="url"
            onChange={handleInputChange}
            placeholder="Blog url"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="me-2">
          Submit
        </Button>
        <Button variant="secondary" onClick={emptyBlogInput}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default AddNewBlog;
