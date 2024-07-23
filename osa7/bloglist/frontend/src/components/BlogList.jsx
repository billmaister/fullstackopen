import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

const BlogList = () => {
  const blogs = useSelector(({ blogs }) => [...blogs].sort((a, b) => b.likes - a.likes));

  return (
    <Container className="mt-5">
      <h2 className="mb-4">List of Blogs</h2>
      <div id="blog-container">
        {blogs.map((blog) => (
          <Card key={blog.id} className="mb-3">
            <Card.Body>
              <Card.Title>
                <Link to={`/blogs/${blog.id}`} className="text-decoration-none">
                  {blog.title} by {blog.author}
                </Link>
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default BlogList;
