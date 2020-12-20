import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((y) => (
          <LinkContainer
            key={y + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${y + 1}`
                  : `/page/${y + 1}`
                : `/admin/productlist/${y + 1}`
            }
          >
            <Pagination.Item active={y + 1 === Number(page)}>
              {y + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};
export default Paginate;
