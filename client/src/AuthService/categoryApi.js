import axios from "axios";

export const getAllCategory = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const { data } = await axios.get("/category/all", config);
  console.log(data);
  return data;
};

export const createCategory = async (category) => {
  try {
    const response = await fetch(`/all`, {
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
