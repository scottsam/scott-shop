import React from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Landing = () => {
  return (
    <>
      <header className="hero ">
        <div className="banner ">
          <h1 className="banner-title bolder">Welcome to My-Shop</h1>

          <h2 className="text-white bolder">Experience Satisfaction</h2>

          <LinkContainer to={`/home`}>
            <Button variant="outline-warning" className="btn btn-lg ">
              Shop now
            </Button>
          </LinkContainer>
        </div>
      </header>
    </>
  );
};

export default Landing;
