import { getAllCategory } from "../AuthService/categoryApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import FormContainer from "../Components/FormContainer";
import { createProduct } from "../Actions/productAction";
import { PRODUCT_CREATE_RESET } from "../Constants/productContants";

const CreateProduct = ({ history }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [photo, setPhoto] = useState("");

  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success, product } = productCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const allCategory = () => {
    getAllCategory().then((data) => {
      setCategories(data);
    });
  };

  const resetForm = () => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    setBrand("");
    setName("");
    setCategory("");
    setCountInStock(0);
    setPhoto("");
    setPrice(0);
    setDescription("");
  };

  useEffect(() => {
    allCategory();

    if (success) {
      history.push(`/admin/product/${product._id}/edit`);
    }
  }, [dispatch, history]);

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

    dispatch(createProduct(formData));
    resetForm();
    setMessage(message);
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">{success}</Message>}

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
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.tag}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              row="20"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Create Product
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};
export default CreateProduct;
