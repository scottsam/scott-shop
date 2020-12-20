import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getCat } from "../AuthService/categoryApi";

const SameCategory = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});

  const { categoryId } = useParams();

  const loadCat = () => {
    getCat(categoryId).then((data) => {
      console.log(data);
      const { products } = data;
      setProducts([...products, products]);
      console.log(products);
    });
  };

  useEffect(() => {
    loadCat();
  }, []);

  return (
    <div className="container my-5">
      <div className="row m-5">
        {products &&
          products.map((product, i) => (
            <div
              className="card col-6-md m-5"
              style={{ width: "150px" }}
              key={i}
            >
              <img
                src={`/product/photo/${product._id}`}
                style={{ height: "200px" }}
              />
              <div className="card-text text-center mb-2">
                <Link to={`/product/${product._id}`}>
                  <button className="btn btn-md btn-warning btn-block ">
                    <b>view product</b>
                  </button>
                </Link>
              </div>
              <div className="card-text text-center">
                <button className="btn btn-sm btn-secondary btn-block">
                  <span>
                    {" "}
                    $ <b>{product.price}</b>
                  </span>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SameCategory;
