import React, { useEffect } from "react";

import { LinkContainer } from "react-router-bootstrap";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Loader from "../Components/Loader";
import Message from "../Components/Message";

import { listUsers, deleteUser } from "../Actions/userActions";

const UserListPage = ({ history }) => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.role === "admin") {
      dispatch(listUsers());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);

  const deletehandler = (id) => {
    if (window.confirm("Are you sure ?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <>
      <section className="sign-in-page">
        <h1>Manage Users</h1>
        <h3>You can Edit or Delete a User Here</h3>
      </section>
      <LinkContainer to={`/profile`}>
        <Button variant="outline-info">Back to dashboard</Button>
      </LinkContainer>
      <h1 className="text-center">Users Log</h1>
      {successDelete && <Message variant="danger">{successDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>

              <th>ROLE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>

                <td>{user.role}</td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button className="btn-primary btn-sm mx-3 mb-2">
                      <i className="fas fa-edit"></i> Edit
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="btn-danger"
                    className="btn-danger btn-sm"
                    onClick={() => deletehandler(user._id)}
                  >
                    <i className="fas fa-edit"></i>Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
export default UserListPage;
