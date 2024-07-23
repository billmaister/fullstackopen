import { useDispatch } from 'react-redux';
import { commentBlog } from '../reducers/blogReducer';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { setNotification } from '../reducers/notificationReducer';

const Comments = ({ blog }) => {
  const dispatch = useDispatch();

  const handleComment = (event) => {
    event.preventDefault();
    if (event.target.commentInput.value.length === 0) {
      dispatch(setNotification('Comment too short', 'error'));
      return;
    }
    dispatch(commentBlog(blog, event.target.commentInput.value));
    event.target.commentInput.value = '';
  };

  if (!blog) {
    return null;
  }

  return (
    <Container className="mt-4">
      <h3>Add New Comment</h3>
      <Form onSubmit={handleComment}>
        <Form.Group className="mb-3" controlId="formComment">
          <Form.Label>New Comment</Form.Label>
          <Form.Control type="text" name="commentInput" placeholder="Enter your comment" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Comment
        </Button>
      </Form>
      <h3 className="mt-4">All Comments</h3>
      <ListGroup>
        {blog.comments.map((comment, idx) => (
          <ListGroup.Item key={idx}>{comment}</ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Comments;
