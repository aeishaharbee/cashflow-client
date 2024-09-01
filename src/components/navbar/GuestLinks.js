import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const GuestLinks = () => {
  return (
    <>
      <Nav.Link as={Link} to="/">
        Home
      </Nav.Link>
      <Nav.Link to="/register" as={Link}>
        Register
      </Nav.Link>
      <Nav.Link to="/login" as={Link}>
        Login
      </Nav.Link>
    </>
  );
};

export default GuestLinks;
