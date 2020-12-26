import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Product from "../Components/ProductCard";
import { getCat } from "../AuthService/categoryApi";
import axios from "axios";
const CategoryPage = ({ history }) => {
  const [category, setCategory] = useState(null);
  const { categoryId } = useParams();

  //const aCategory = () => {
  // getCat(categoryId).then((data) => {
  // console.log(data);
  // setCategory(data);
  // });
  //};
  const aCategory = () => {
    axios.get(`/category/${categoryId}`).then((resp) => {
      const { data } = resp;
      setCategory(data);
    });
  };

  useEffect(() => {
    aCategory();
    history.push(`/category/${categoryId}`);
  }, [categoryId]);

  return (
    <>
      {category && (
        <>
          <section className="sign-in-page">
            <h1>{category.tag}</h1>

            <h3>Check Out Our Latest {category.tag} Here</h3>
            <h3>Very Affordale for your Comfort.</h3>
          </section>
          <section>
            <Container>
              <Row className="mb-5">
                {category.products.map((product, i) => (
                  <Col key={i} sm={12} md={6} lg={3} className="mb-3">
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        </>
      )}
    </>
  );
};

export default CategoryPage;
