import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DefaultPic from "../Components/Image/doug_full1.png";

import Loader from "../Components/Loader";
import Message from "../Components/Message";

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../Actions/orderActions";

import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../Constants/orderConstants";

const OrderPage = ({ history, match }) => {
  const { orderId } = useParams();
  const [sdkReady, setSdkReady] = useState(false);
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);

  const { loading: loadingPay, success: successPay } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);

  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    const addDecimals = (num) => {
      return Math.round((num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  const handleDeliver = () => {
    dispatch(deliverOrder(order));
  };
  const paymentSuccesshandle = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>
        OrderId: <span className="ml-2 text-info">{order._id}</span>
      </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping Details</h2>
              <div>
                <p>
                  <strong>
                    <b>Name: </b>
                  </strong>

                  <strong>
                    <span className="ml-2 text-info">{order.user.name}</span>
                  </strong>
                </p>
              </div>
              <div>
                <p>
                  <strong>
                    <b>Email:</b>
                  </strong>{" "}
                  <span className="ml-2 text-info">
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <strong>
                    <b>Address:</b>
                  </strong>{" "}
                  <span className="ml-2 text-info">
                    {" "}
                    <strong>{order.shippingAddress.address} </strong>
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <strong>
                    <b>City:</b>
                  </strong>{" "}
                  <span className="ml-2 text-info">
                    {" "}
                    <strong>{order.shippingAddress.city} </strong>
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <strong>
                    <b>Postal Code:</b>
                  </strong>{" "}
                  <span className="ml-2 text-info">
                    <strong>{order.shippingAddress.postalCode}</strong>
                    {""}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <strong>
                    <b>Country:</b>
                  </strong>{" "}
                  <span className="ml-2 text-info">
                    <strong>{order.shippingAddress.country}</strong>
                  </span>
                </p>
              </div>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <div>
                <p>
                  <strong>
                    <b>Method:</b>
                  </strong>{" "}
                  <span className="ml-2 text-info">
                    <strong>{order.paymentMethod}</strong>
                  </span>
                </p>
              </div>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Ordered Items</h2>

              {order.orderItems.length === 0 ? (
                <Message>Your order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, i) => (
                    <ListGroup.Item key={i}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={`/product/photo/${item.product}`}
                            onError={(i) => (i.target.src = `${DefaultPic}`)}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          <h3>Estimate:</h3>
                          <strong>
                            {" "}
                            {item.quantity} x ${item.price} = $
                            {item.quantity * item.price}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Items</strong>
                  </Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Shipping</strong>
                  </Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Tax</strong>
                  </Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={paymentSuccesshandle}
                    />
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    disabled={order.orderItems === 0}
                    onClick={handleDeliver}
                  >
                    Mark as Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default OrderPage;
