import { Nav, Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../../api/usersApi";
import { clearToken } from "../../utils/authToken";

const UserLinks = ({ setToken }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUserInfo,
  });

  const logoutHandler = () => {
    clearToken();
    setToken(null);
  };

  if (isLoading)
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );

  return (
    <>
      <Nav.Link as={Link} to="/dashboard">
        Dashboard
      </Nav.Link>
      <Nav.Link as={Link} to="/expenses">
        Expenses
      </Nav.Link>
      <Nav.Link as={Link} to="/budgets">
        Budgets
      </Nav.Link>

      <Nav.Link onClick={logoutHandler} as={Link} to="/">
        Logout
      </Nav.Link>

      <Nav.Link disabled className="fw-semibold" style={{ opacity: 1 }}>
        {data.username}
      </Nav.Link>
    </>
  );
};

export default UserLinks;
