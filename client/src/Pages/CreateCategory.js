import React, { useState, useEffect } from "react";
import { createCategory } from "../AuthService/categoryApi";

const Category = () => {
  const [category, setCategory] = useState({ tag: "" });

  const { tag } = category;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ [name]: value });
  };

  const reset = () => {
    setCategory({ tag: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createCategory(category).then((data) => {
      console.log(data);
      reset();
    });
  };

  return (
    <>
      <section className="sign-in-page">
        <h1>Create Product Category</h1>
        <h3>Sign in and see our latest products</h3>
      </section>
      <div className="card container w-25">
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="tag">Category</label>
          <div className="form-group">
            <input
              type="text"
              value={category.tag}
              name="tag"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input type="submit" className="btn btn-primary btn-block" />
          </div>
        </form>
      </div>
    </>
  );
};

export default Category;
