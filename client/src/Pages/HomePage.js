import React, { useEffect, useState } from "react";
import { getAllCategory } from "../AuthService/categoryApi";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Container, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { listProduct } from "../Actions/productAction";
import Paginate from "../Components/Pagination";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import Product from "../Components/ProductCard";
import ProductCarosel from "../Components/ProductCarol";
import HelmetMeta from "../Components/Helmet";

const HomePage = ({}) => {
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages } = productList;
  const { keyword, pageNumber } = useParams();

  const allCategory = () => {
    getAllCategory().then((data) => {
      setCategories(data);
    });
  };

  useEffect(() => {
    allCategory();

    dispatch(listProduct(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <HelmetMeta />
      {!keyword ? (
        <ProductCarosel />
      ) : (
        <Link to="/home" className="btn btn-light">
          Go Back
        </Link>
      )}
      <Container>
        <Dropdown className="m-3">
          <Dropdown.Toggle variant="outline-primary">
            Categories
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {categories.map((cat, i) => (
              <Dropdown.Item href={`/product-category/${cat._id}`} key={i}>
                {cat.tag}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <h1>Latest Products</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Row className="mb-5">
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={3} className="mb-3">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
            <Paginate
              pages={pages}
              page={pageNumber}
              keyword={keyword ? keyword : ""}
            />
          </>
        )}
      </Container>
    </>
  );
};
export default HomePage;
