import { isAuth } from "../utils/authToken";
import { Container, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../api/usersApi";

const Profile = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUserInfo,
  });

  if (isLoading)
    return (
      <Container className="my-5 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );

  if (!isAuth())
    return (
      <Container className="my-5">
        <h2>Can't access this page.</h2>
      </Container>
    );

  return (
    <>
      <Container className="my-5">
        <h2 className="mb-3">Profile</h2>
        <div className="w-full d-flex flex-column ">
          <div className="d-flex gap-2">
            <p>Username: </p>
            <p className="fw-semibold">{data.username}</p>
          </div>
          <div className="d-flex gap-2">
            <p>Name: </p>
            <p className="fw-semibold">{data.name}</p>
          </div>
          <div className="d-flex gap-2">
            <p>Email: </p>
            <p className="fw-semibold">{data.email}</p>
          </div>
          {/* <div className="d-flex gap-2">
            <p>Name: </p>
            <p>{data.name}</p>
          </div> */}
        </div>
      </Container>
    </>
  );
};

export default Profile;
