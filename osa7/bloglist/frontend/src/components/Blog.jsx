import { useDispatch, useSelector } from 'react-redux';
import { likeBlog } from '../reducers/blogReducer';
import { useParams } from 'react-router-dom';
import Comments from './Comments';
import { Container, Button, Card } from 'react-bootstrap';

const Blog = () => {
  let { id } = useParams();

  const dispatch = useDispatch();

  const blog = useSelector(({ blogs }) => [...blogs].find((b) => b.id === id));

  const handleBlogLike = async (event) => {
    event.preventDefault();
    dispatch(likeBlog(blog));
  };

  if (!blog) {
    return null;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title>
            {blog.title}, {blog.author}
          </Card.Title>
          <Card.Link href={blog.url} target="_blank">
            {blog.url}
          </Card.Link>
          <Card.Text>
            {blog.likes} likes{' '}
            <Button variant="primary" onClick={handleBlogLike}>
              Like
            </Button>
          </Card.Text>
          <Card.Text>added by {blog.user.name}</Card.Text>
        </Card.Body>
      </Card>
      <Comments blog={blog} />
    </Container>
  );
};

export default Blog;
