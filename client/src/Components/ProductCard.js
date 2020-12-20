import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <>
      <Card className="rounded text-center tag h-100 ">
        <Link to={`/product/${product._id}`}>
          <Card.Img
            src={`/product/photo/${product._id}`}
            variant="top"
            style={{ height: "230px" }}
          />
        </Link>
        <Card.Body>
          <Link to={`/product/${product._id}`}>
            <Card.Title as="div">
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>
          <Card.Text as="div">
            <Rating
              value={product.rating}
              text={`${product.numberOfReviews} reviews`}
            />
          </Card.Text>
          <Card.Text as="h3">
            <span>$</span>
            {product.price}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default Product;
