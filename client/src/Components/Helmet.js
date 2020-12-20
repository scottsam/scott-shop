import React from "react";
import { Helmet } from "react-helmet";

const HelmetMeta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

HelmetMeta.defaultProps = {
  title: "Welcome to eShop",
  description: "We sell the best of any product for cheap",
  keywords: "electronics,buy electronics,cheap electronics",
};

export default HelmetMeta;
