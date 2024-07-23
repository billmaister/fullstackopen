import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, ListGroup, Card } from 'react-bootstrap';

const User = () => {
  const { id } = useParams();
  const user = useSelector(({ appUsers }) => appUsers.find((user) => user.id === id));

  if (!user) {
    return null;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title>{user.name}</Card.Title>
          <Card.Text>Added Blogs</Card.Text>
          <ListGroup variant="flush">
            {user.blogs.map((blog) => (
              <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default User;
