import AddNewBlog from './AddNewBlog';
import BlogList from './BlogList';
import { useSelector } from 'react-redux';
import { Container, Alert, Row, Col } from 'react-bootstrap';

const Home = () => {
  const user = useSelector(({ user }) => user);

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Welcome to the Blog App</h1>
      <Row>
        <Col>
          {user ? <AddNewBlog /> : <Alert variant="warning">Please log in to add blogs...</Alert>}
        </Col>
      </Row>
      <Row>
        <Col>
          <BlogList />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
