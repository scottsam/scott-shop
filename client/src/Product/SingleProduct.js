import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { singleProduct } from "../AuthService/productApi";

const Product = () => {
  const [product, setProduct] = useState({});
  const [category, setCategory] = useState({});
  const [merchant, setMerchant] = useState({});
  const { productId } = useParams();

  const loadProduct = () => {
    singleProduct(productId).then((data) => {
      console.log(data);
      const { category, merchant, description, price } = data;
      Object.assign(category, category);
      Object.assign(merchant, merchant);
      setCategory({ ...category, category });
      setMerchant({ ...merchant, merchant });
      Object.assign(product, data);
      setProduct({ ...product, product });
    });
  };
  console.log(category._id);

  useEffect(() => {
    loadProduct();
  }, []);

  return (
    <div className="container my-5">
      <div className="row ">
        <div className="card col-6-md" style={{ width: "300px" }}>
          <img src={`photo/${productId}`} style={{ height: "400px" }} />
        </div>
        <div
          className=" mx-5 text-center col-6-md my-5"
          style={{ width: "500px" }}
        >
          <h3>Product Details</h3>
          <hr />
          <div>
            <h5>Description</h5>
            <p>{product.description}</p>
          </div>
          <hr />
          <div>
            <h5>Product Type</h5>
            <p>{category.tag}</p>
          </div>
          <hr />
          <div>
            <Link
              className="btn btn-md btn-primary"
              to={`user/${merchant._id}`}
            >
              <h5>Contact Seller</h5>
            </Link>
            <p>
              <b>Name:</b> {merchant.name}
            </p>
            <p>
              <b>Phone:</b> {merchant.phone}
            </p>
            <p>
              <b>Email:</b> {merchant.email}
            </p>
          </div>
          <hr />
          <div>
            <Link
              className="btn btn-lg btn-success"
              to={`/category/${category._id}`}
            >
              View related products here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
