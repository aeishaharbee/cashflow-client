import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { registerUser } from "../api/usersApi";
import { useNavigate } from "react-router-dom";
import { isAuth } from "../utils/authToken";

const Register = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const { mutate } = useMutation({ mutationFn: registerUser });
  const queryClient = useQueryClient();

  const onChangeHandler = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (user.password !== user.cPassword)
      return Swal.fire({
        title: "Error!",
        text: "Password not matched.",
        icon: "error",
      });

    if (
      !user.name ||
      !user.username ||
      !user.email ||
      !user.password ||
      !user.cPassword
    )
      return Swal.fire({
        title: "Error!",
        text: "All fields are required.",
        icon: "error",
      });

    mutate(user, {
      onSuccess: (data) => {
        Swal.fire({ title: "Success!", text: data.msg, icon: "success" });
        queryClient.invalidateQueries({ queryKey: ["users"] });

        return navigate("/login");
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
          <h1 className="mt-5 text-center">Register</h1>
          <Form className="mt-5" onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={onChangeHandler}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={onChangeHandler}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
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
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="cPassword"
                onChange={onChangeHandler}
              />
            </Form.Group>
            <Button variant="info" type="submit">
              Register
            </Button>
          </Form>
          <p className="text-end">
            Already have an account? <a href="/login">Log In here.</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
