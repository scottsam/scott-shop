import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import FormContainer from "../Components/FormContainer";
import { listproductDetails, updateProduct } from "../Actions/productAction";
import { PRODUCT_CREATE_RESET } from "../Constants/productContants";

const ProductEditScreen = ({ history, match }) => {
  const { productId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [photo, setPhoto] = useState("");

  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});
  const [countInStock, setCountInStock] = useState(0);
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    successUpdate,
  } = productUpdate;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);

  const allCategory = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get("/categories", config);
    setCategories(data);
  };

  useEffect(() => {
    allCategory();
    if (successUpdate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      history.push("/admin/productlist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listproductDetails(productId));
      } else {
        setName(product.name);
        setBrand(product.brand);
        setPrice(product.price);
        setPhoto(product.photo);
        setCategory(product.category._id);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, history, productId, product, successUpdate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("photo", photo);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("countInStock", countInStock);

    dispatch(updateProduct(formData, productId));
    dispatch({ type: PRODUCT_CREATE_RESET });
    setBrand("");
    setName("");
    setCategory("");
    setCountInStock(0);
    setPhoto("");
    setPrice(0);
    setDescription("");
    setMessage(message);
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name of product"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="price"
                placeholder="Enter price of product"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="photo">
              <Form.Label>Product Photo</Form.Label>

              <Form.File
                id="image-file"
                label="Choose file"
                custom
                onChange={(e) => setPhoto(e.target.files[0])}
              ></Form.File>
            </Form.Group>
            <Form.Group controlId="brand">
              <Form.Label>Product Brand</Form.Label>
              <Form.Control
                type="brand"
                placeholder="Enter product brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock">
              <Form.Label>Amount in Stock</Form.Label>
              <Form.Control
                type="countInStock"
                placeholder="Enter stock count of product.."
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Product Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select..</option>
                {categories &&
                  categories.map((c, i) => (
                    <option key={i} value={c._id}>
                      {c.tag}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows="5"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary">
              Edit Product
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
