import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Actions/userActions";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import FormContainer from "../Components/FormContainer";

const Login = ({ location, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split("=")[1] : "/home";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login(email, password));
  };

  return (
    <>
      <section className="sign-in-page">
        <h1>Welcome!</h1>
        <h3>Sign in and see our latest products</h3>
      </section>
      <FormContainer>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="btn btn-block btn-info"
          >
            Login
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            Are you new?
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Register
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default Login;
