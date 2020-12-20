import React, { useState, useEffect } from "react";
import { allProducts } from "../AuthService/productApi";

import { Link, useParams } from "react-router-dom";

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState("");

  const loadProducts = () => {
    allProducts(page).then((data) => {
      console.log(data);
      const { totalPages, currentPage, products } = data;
      setProducts([...products, products]);
      setPage(Number(currentPage));
      setTotal(totalPages);
    });
  };

  const nextPage = () => {
    setPage((p) => p + 1);
  };
  const prevPage = () => {
    setPage((p) => p - 1);
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  return (
    <div className="container my-5 ">
      <div className="row">
        {products
          ? products.map((product, i) => {
              return (
                <div className="col-sm-4  my-5 text-center" key={i}>
                  <div className="card " style={{ width: "250px" }}>
                    <img
                      src={`product/photo/${product._id}`}
                      className="card-img-top w-100"
                      style={{ height: "200px" }}
                    />
                    <div className="card-footer">
                      <h5 className="card-text"> {product.name}</h5>

                      <h4 className="card-text">
                        <span>$</span>{" "}
                        <p className="badge badge-success badge-block">
                          {product.price}
                        </p>
                      </h4>
                      <Link
                        to={`product/${product._id}`}
                        className="btn btn-primary btn-block"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
      <div className="mt-3 justify">
        <ul className="pagination text-center">
          <li className="page-item">
            <a className="page-link" href="#" onClick={prevPage}>
              previous
            </a>
          </li>

          <li className="page-item">
            <a className="page-link" href="#" onClick={nextPage}>
              next
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AllProduct;
