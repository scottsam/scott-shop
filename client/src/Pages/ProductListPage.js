import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import Paginate from "../Components/Pagination";
import axios from "axios";

import {
  listProduct,
  deleteProduct,
  createProduct,
} from "../Actions/productAction";
import { PRODUCT_CREATE_RESET } from "../Constants/productContants";

const ProductListPage = ({ history, match }) => {
  const [category, setCategory] = useState([]);
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  const productDeletes = useSelector((state) => state.productDeletes);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDeletes;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const {
    userInfo: { role },
  } = userLogin;

  const isAdmin = role === "admin" ? true : false;
  const allCategory = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get("/categories", config);
    setCategory(data);
  };

  useEffect(() => {
    allCategory();
    dispatch({ type: PRODUCT_CREATE_RESET });

    dispatch(listProduct("", pageNumber));
  }, [dispatch, successDelete, successCreate, pageNumber]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      <section className="sign-in-page">
        <h1>Manage Products</h1>
        <h3>You can Eddit or Delete a Product Here</h3>
      </section>
      <LinkContainer to={`/profile`}>
        <Button variant="outline-info">Back to dashboard</Button>
      </LinkContainer>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>

                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  {category.map((c) =>
                    c._id === product.category ? (
                      <td key={c._id}>{c.tag}</td>
                    ) : null
                  )}

                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button className="btn-primary btn-sm mx-3 mb-2">
                        <i className="fas fa-edit"></i> Edit
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="btn-danger"
                      className="btn-danger btn-sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      <i className="fas fa-edit"></i>Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={isAdmin} />
        </>
      )}
    </>
  );
};

export default ProductListPage;
