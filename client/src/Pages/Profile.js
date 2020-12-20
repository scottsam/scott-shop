import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Table, Row, Col, ListGroup, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../Components/Loader";
import Message from "../Components/Message";

import { getUserdetails, updateUserProfile } from "../Actions/userActions";
import { listMyOrders } from "../Actions/orderActions";

const Profile = ({ history, location }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch(getUserdetails("profile"));
      } else {
        dispatch(listMyOrders(user.id));
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  return (
    <>
      <section className="sign-in-page">
        <h1>WELCOME , {user.role !== "admin" ? user.name : "Admin"}!</h1>
        <h3>You can update your details here</h3>
      </section>
      {user.role !== "admin" ? (
        <Row className="m-3">
          <Col md={6} className="mb-3">
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-secondary">
                  <Card.Title>User Information</Card.Title>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Name :</strong> {user.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email Address:</strong>
                  {user.email}
                </ListGroup.Item>{" "}
                <ListGroup.Item>
                  <strong>Role:</strong> {user.role}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-secondary">
                  <Card.Title>User Tasks</Card.Title>
                </ListGroup.Item>
                <Link to={`/cart/:productId`}>
                  <ListGroup.Item>Your Cart</ListGroup.Item>
                </Link>
                <Link to={`/update-profile`}>
                  <ListGroup.Item>Update Profile</ListGroup.Item>
                </Link>
              </ListGroup>
            </Card>
          </Col>
          <Col md={9}>
            <h2 className="user">My Order History</h2>
            {loadingOrders ? (
              <Loader />
            ) : errorOrders ? (
              <Message variant="danger">{errorOrders}</Message>
            ) : (
              <Table
                striped
                bordered
                hover
                responsive
                className="table-sm mb-3"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TIME</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user && order.user.name}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.createdAt.substring(11, 19)}</td>
                      <td>{order.totalPrice}</td>
                      <td className={order.isPaid ? "bg-success" : "bg-danger"}>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <i
                            className="fas fa-times"
                            style={{ color: "red" }}
                          ></i>
                        )}
                      </td>
                      <td
                        className={
                          order.isDelivered ? "bg-success" : "bg-danger"
                        }
                      >
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i
                            className="fas fa-times"
                            style={{ color: "red" }}
                          ></i>
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`order/${order._id}`}>
                          <Button
                            type="submit"
                            className="btn-sm mx-3 "
                            variant="outline-info"
                          >
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      ) : (
        <Row className="m-3">
          <Col md={6} className="mb-3">
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-secondary">
                  <Card.Title>User Information</Card.Title>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Name :</strong> {user.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email Address:</strong>
                  {user.email}
                </ListGroup.Item>{" "}
                <ListGroup.Item>
                  <strong>Role:</strong> {user.role}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-secondary">
                  <Card.Title>Admin Tasks</Card.Title>
                </ListGroup.Item>
                <Link to={`/admin/category/create`}>
                  <ListGroup.Item>Create Category</ListGroup.Item>
                </Link>
                <Link to={`/admin/product/create`}>
                  <ListGroup.Item>Create Products</ListGroup.Item>
                </Link>
                <Link to={`/admin/orderlist`}>
                  <ListGroup.Item>Manage Orders</ListGroup.Item>
                </Link>
                <Link to={`/admin/userlist`}>
                  <ListGroup.Item>Manage Users</ListGroup.Item>
                </Link>
                <Link to={`/admin/productlist`}>
                  <ListGroup.Item>Manage Products</ListGroup.Item>
                </Link>
                <Link to={`/update-profile`}>
                  <ListGroup.Item>Update Profile</ListGroup.Item>
                </Link>
              </ListGroup>
            </Card>
          </Col>
          <Col md={9}>
            <h2 className="user">My Order History</h2>
            {loadingOrders ? (
              <Loader />
            ) : errorOrders ? (
              <Message variant="danger">{errorOrders}</Message>
            ) : (
              <Table
                striped
                bordered
                hover
                responsive
                className="table-sm mb-3"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TIME</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user && order.user.name}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.createdAt.substring(11, 19)}</td>
                      <td>{order.totalPrice}</td>
                      <td className={order.isPaid ? "bg-success" : "bg-danger"}>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <i
                            className="fas fa-times"
                            style={{ color: "red" }}
                          ></i>
                        )}
                      </td>
                      <td
                        className={
                          order.isDelivered ? "bg-success" : "bg-danger"
                        }
                      >
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i
                            className="fas fa-times"
                            style={{ color: "red" }}
                          ></i>
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`order/${order._id}`}>
                          <Button
                            type="submit"
                            className="btn-sm mx-3 "
                            variant="outline-info"
                          >
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};
export default Profile;
