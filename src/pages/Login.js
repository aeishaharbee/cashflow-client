import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { saveToken } from "../utils/authToken";
import { loginUser } from "../api/usersApi";
import { useNavigate } from "react-router-dom";
import { isAuth } from "../utils/authToken";

const Login = ({ setToken }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const { mutate } = useMutation({ mutationFn: loginUser });
  const queryClient = useQueryClient();

  const onChangeHandler = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    mutate(user, {
      onSuccess: (data) => {
        Swal.fire({ title: "Success!", text: data.msg, icon: "success" });
        queryClient.invalidateQueries({ queryKey: ["users"] });

        saveToken(data.token);
        setToken(data.token);

        return navigate("/dashboard");
      },
      onError: (error) =>
        Swal.fire({
          title: "Error!",
          text: error.response.data.msg,
          icon: "error",
        }),
    });
  };

  if (isAuth())
    return (
      <Container className="my-5">
        <h2>Already logged in</h2>
      </Container>
    );

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="mt-5 text-center">Login</h1>
          <Form className="my-5" onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={onChangeHandler}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={onChangeHandler}
              />
            </Form.Group>
            <Button variant="info" type="submit">
              Login
            </Button>
            <p className="text-end">
              Don't have an account? <a href="/register">Register here.</a>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
