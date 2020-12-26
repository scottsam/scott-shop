import axios from "axios";

export const getCategory = async () => {
  try {
    const response = await fetch("/categories", {
      method: "get",
    });
    const data = await response.json();

    return data;
  } catch (err) {
    console.log("apiUser:", err);
  }
};
export const getCat = async (categoryId) => {
  try {
    const response = await fetch(`/category/${categoryId}`, {
      method: "get",

      headers: {
        "Content-Type": "application/json",
      },
    });
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
