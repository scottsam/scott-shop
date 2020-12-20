//update user info
export const createProduct333 = async (userId, token, product) => {
  try {
    const response = await fetch(`/product/${userId}`, {
      method: "POST",
      headers: {
        "x-login-token": `${token}`,

        Accept: "application/json",
      },
      body: product,
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return console.log(err);
  }
};

//create list of posts
export const allProducts = async (currentPage) => {
  try {
    const response = await fetch(`/products?page=${currentPage}`, {
      method: "GET",
    });
    return response.json(response);
  } catch (err) {
    return console.log(err);
  }
};

//create  a single post view
export const singleProduct = (productId) => {
  return fetch(`/product/${productId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listByUser = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//remove post
export const remove = (postId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//update user info
export const update = (postId, token, post) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: post,
  })
    .then((response) => {
      console.log(response);

      return response.json();
    })
    .catch((err) => console.log(err));
};
