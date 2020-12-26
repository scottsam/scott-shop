import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Image,
  ListGroup,
  Card,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import HelmetMeta from "../Components/Helmet";
import Rating from "../Components/Rating";
import { PRODUCT_CREATE_REVIEW_RESET } from "../Constants/productContants";
import DefaultPic from "../Components/Image/doug_full1.png";

import {
  listproductDetails,
  createProductReview,
} from "../Actions/productAction";

const ProductPage = ({ history, match }) => {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState(null);
  const { productId } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    error: errorProductReview,
    product: productReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      alert("Review Submitted");

      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listproductDetails(productId));
  }, [dispatch, productId, successProductReview]);

  const addToCartHandle = (e) => {
    history.push(`/cart/${product._id}?quantity=${quantity}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProductReview(productId, { rating, comment }));
    setRating(0);
    setComment("");
    setMessage(message);
  };

  return (
    <>
      <Link to="/home">Go back</Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <section className="m-3">
            <HelmetMeta title={product.name} />
            <Row className="text-center">
              <Col md={6}>
                <Image
                  src={`/product/photo/${productId}`}
                  fluid
                  rounded
                  onError={(i) => (i.target.src = `${DefaultPic}`)}
                />
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h4>{product.name}</h4>
                  </Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Card.Text>
                        <Rating
                          value={product.rating}
                          text={`${product.numberOfReviews} reviews`}
                        />
                      </Card.Text>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p>
                        <b>Price: </b> ${product.price}
                      </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p>
                        <b>Description:</b>
                      </p>
                      <p className="text-wrap ">{product.description}</p>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>${product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>

                        <Col>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>Quantity:</Col>
                          <Col>
                            <Form.Control
                              as="select"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}
                    <ListGroup.Item>
                      <Button
                        onClick={addToCartHandle}
                        className="btn-block"
                        type="button"
                        variant="outline-success"
                      >
                        Add To Cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </section>
          <section className="m-3">
            <Row className="text-center">
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <h3>Reviews</h3>
                  </Card.Header>
                  {product.reviews.length === 0 && (
                    <Message>No Reviews</Message>
                  )}
                  <ListGroup variant="flush">
                    {product.reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <Card.Body>
                          <Card.Subtitle>
                            <h5>
                              {" "}
                              <b className="font-weight-bolder text-dark">
                                {review.name}
                              </b>
                            </h5>
                          </Card.Subtitle>
                          <Card.Text>
                            <span id="coma">"</span> {review.comment}....
                            <span id="coma">"</span>
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <Rating value={review.rating} />

                          <Card.Text>
                            {review.createdAt.substring(0, 10)}
                          </Card.Text>
                        </Card.Footer>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>
                    {" "}
                    <h3>Write a customer review</h3>
                  </Card.Header>
                  <ListGroup>
                    <ListGroup.Item>
                      {errorProductReview && (
                        <Message variant="danger">{errorProductReview}</Message>
                      )}
                      {successProductReview && (
                        <Message variant="success">
                          {successProductReview}
                        </Message>
                      )}

                      {userInfo ? (
                        <Form onSubmit={handleSubmit}>
                          <Form.Group controlId="rating">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                              as="select"
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                            >
                              <option value="">Select..</option>
                              <option value="1">1 - Poor</option>
                              <option value="2">2 - Fair</option>
                              <option value="3">3 - Good</option>
                              <option value="4">4 - Very Good</option>
                              <option value="5">5 - Excellent</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="comment">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              row="3"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                          <Button variant="primary" type="submit">
                            Submit
                          </Button>
                        </Form>
                      ) : (
                        <Message>
                          Please <Link to="/login">sign in</Link> to write a
                          review{" "}
                        </Message>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </section>
        </>
      )}
    </>
  );
};
export default ProductPage;
