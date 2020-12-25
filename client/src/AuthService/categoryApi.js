import axios from "axios";

export const getCategory = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get("/categories", config);
    const data = await response.json();

    return data;
  } catch (err) {
    console.log("apiUser:", err);
  }
};
export const getCat = async (categoryId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(`/category/${categoryId}`, config);
    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createCategory = async (category) => {
  try {
    const response = await fetch(`/category`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(category),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return console.log(err);
  }
};
