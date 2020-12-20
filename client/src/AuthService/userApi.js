export const getUser = (userId, token) => {
  return fetch(`/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-login-token": `${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("apiUser:", err));
};
