import { Container, Nav, Navbar } from "react-bootstrap";
import GuestLinks from "./GuestLinks";
import UserLinks from "./UserLinks";

const TopNav = ({ token, setToken }) => {
  return (
    <Navbar bg="info" expand="lg">
      <Container>
        <Navbar.Brand className=" fw-bold">CashFlow</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-nav" />
        <Navbar.Collapse id="basic-nav">
          <Nav className="ms-auto">
            {token ? (
              <>
                <UserLinks setToken={setToken} />
              </>
            ) : (
              <GuestLinks />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
