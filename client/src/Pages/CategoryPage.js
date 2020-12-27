import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Product from "../Components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { listProductCategory } from "../Actions/productAction";

const CategoryPage = ({}) => {
  const { categoryId } = useParams();

  const dispatch = useDispatch();
  const productCategory = useSelector((state) => state.productCategory);
  const { products } = productCategory;

  useEffect(() => {
    dispatch(listProductCategory(categoryId));
  }, []);

  return (
    <>
      <>
        <section className="sign-in-page">
          <h1></h1>

          <h3>Check Out Our Latest Here</h3>
          <h3>Very Affordale for your Comfort.</h3>
        </section>
        <section>
          <Container>
            <Row className="mb-5">
              {products.map((product, i) => (
                <Col key={i} sm={12} md={6} lg={3} className="mb-3">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </>
    </>
  );
};

export default CategoryPage;
