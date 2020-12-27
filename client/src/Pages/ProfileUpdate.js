import React, { useEffect, useState } from "react";

import { Button, Form } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";

import Loader from "../Components/Loader";
import Message from "../Components/Message";
import FormContainer from "../Components/FormContainer";

import { getUserdetails, updateUserProfile } from "../Actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../Constants/userConstant";
import { Link } from "react-router-dom";
const ProfileUpdate = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserdetails("profile"));
        history.push("/profile");
      } else {
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Password no match");
    } else {
      dispatch(updateUserProfile({ _id: user.id, name, email, password }));
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <>
      <section className="sign-in-page">
        <h1>My Profile</h1>
        <h3>You can update your details here</h3>
      </section>
      <Link to={`/profile`}>Back to dashboard</Link>
      <FormContainer>
        <h2 className="text-center">Update your profile</h2>

        {message && <Message variant="danger">{message}</Message>}
        {""}
        {success && <Message variant="success">{success}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
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
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="outline-primary"
              className="btn btn-block"
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProfileUpdate;
