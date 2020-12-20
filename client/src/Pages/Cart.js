import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../Actions/cartActions";

import Message from "../Components/Message";

const Cart = ({ location, history }) => {
  const { productId } = useParams();
  const quantity = location.search ? Number(location.search.split("=")[1]) : 1;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, quantity));
    }
  }, [dispatch, productId, quantity]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const checkoutHandle = () => {
    history.push("/login?redirect=shipping");
  };

  return (
    <Row className="m-3">
      <Col md={6} className=" text-center">
        <Card>
          <Card.Header>
            <h3>Your Cart</h3>
          </Card.Header>
          <Card.Body>
            {cartItems.length === 0 ? (
              <Message>
                Your cart is empty
                <Link to="/home" className="ml-3">
                  Go Back
                </Link>
              </Message>
            ) : (
              <ListGroup variant="flush" className="text-center mb-5">
                {cartItems.map((item, i) => (
                  <ListGroup.Item key={i}>
                    <Row>
                      <Col md={3}>
                        <Image
                          src={`/product/photo/${item.product}`}
                          alt={item.name}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col md={2}>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>
                        <span>$</span> {item.price}
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          as="select"
                          value={item.quantity}
                          onChange={(e) =>
                            dispatch(
                              addToCart(item.product, Number(e.target.value))
                            )
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleRemove(item.product)}
                        >
                          <i className="fas fa-trash"></i>remove
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col md={5} className="m-5 text-center">
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </h2>
              <span>$</span>
              {cartItems
                .reduce(
                  (acc, item) =>
                    acc + Number(item.quantity) * Number(item.price),
                  0
                )
                .toFixed(2)}
            </ListGroup.Item>
          </ListGroup>
          <Button type="button" className="btn-block" onClick={checkoutHandle}>
            Proceed To Checkout
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default Cart;
