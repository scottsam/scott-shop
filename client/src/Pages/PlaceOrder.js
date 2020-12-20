import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../Actions/orderActions";
import { ORDER_CREATE_RESET } from "../Constants/orderConstants";
import CheckoutSteps from "../Components/CheckOutSteps";
import Message from "../Components/Message";

const PlaceOrder = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const addDecimals = (num) => {
    return Math.round((num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  cart.totalPrice =
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice);

  const orderCreate = useSelector((state) => state.orderCreate);

  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, success]);

  const placeOrderHandle = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        paymentMethod: cart.paymentMethod,
        totalPrice: cart.totalPrice,
        shippingAddress: cart.shippingAddress,
        itemsPrice: cart.itemsPrice,
      })
    );
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <div>
                <p>
                  <strong>
                    <b>Address:</b>
                  </strong>{" "}
                  <span className="ml-2 text-info">
                    {" "}
                    <strong>{cart.shippingAddress.address} </strong>
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
                    <strong>{cart.shippingAddress.city} </strong>
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <strong>
                    <b>Postal Code:</b>
                  </strong>{" "}
                  <span className="ml-2 text-info">
                    <strong>{cart.shippingAddress.postalCode}</strong>
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
                    <strong>{cart.shippingAddress.country}</strong>
                  </span>
                </p>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <div>
                <p>
                  <strong>
                    <b>Method:</b>
                  </strong>{" "}
                  <span className="ml-2 text-info">
                    <strong>{cart.paymentMethod}</strong>
                  </span>
                </p>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>

              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, i) => (
                    <ListGroup.Item key={i}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={`/product/photo/${item.product}`}
                            alt={item.name}
                            fluid
                            roundedCircle
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.quantity} x ${item.price} = $
                          {item.quantity * item.price}
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
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  onClick={placeOrderHandle}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrder;
