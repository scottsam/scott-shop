import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { listTopProduct } from "../Actions/productAction";

const ProductCarosel = () => {
  const dispatch = useDispatch();
  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading, error, products } = productTopRated;

  useEffect(() => {
    dispatch(listTopProduct());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-secondary text-center">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Carousel.Caption className="carousel-caption">
              <h3>
                {product.name} ($ {product.price})
              </h3>
            </Carousel.Caption>
            <Image src={`/product/photo/${product._id}`} alt={product.name} />
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarosel;
