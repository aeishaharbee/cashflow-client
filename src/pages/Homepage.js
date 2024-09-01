import { isAuth } from "../utils/authToken";
import { Button, Container, Image } from "react-bootstrap";

const Homepage = () => {
  if (isAuth())
    return (
      <Container className="my-5">
        <h2>Already logged in.</h2>
      </Container>
    );

  return (
    <>
      <Container className="my-5 d-flex flex-column align-items-center text-center ">
        {/* <h1>CashFlow</h1> */}
        <h2>Know Your Flow, Grow Your Dough!</h2>
        <Image src="/icon.png" width={500} className="my-5" />
        <Button variant="info" href="/register">
          Register Now
        </Button>
      </Container>
    </>
  );
};

export default Homepage;
