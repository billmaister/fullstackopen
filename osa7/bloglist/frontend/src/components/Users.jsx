import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Table } from 'react-bootstrap';

const Users = () => {
  const appUsers = useSelector(({ appUsers }) => appUsers);

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Users</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {appUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <LinkContainer to={`/users/${user.id}`}>
                  <a href={`/users/${user.id}`}>{user.name}</a>
                </LinkContainer>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Users;
