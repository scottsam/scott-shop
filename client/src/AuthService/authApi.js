export default {
  register: async (user) => {
    try {
      const result = await fetch("/register", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await result.json();

      return data;
    } catch (err) {
      console.log(err);
    }
  },

  signin: async (user) => {
    try {
      const result = await fetch("/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await result.json();

      if (data.accessToken) {
        localStorage.setItem("user", JSON.stringify(data));
      }
      return data;
    } catch (err) {
      console.log(err);
    }
  },

  isAuthenticated: () => {
    if (typeof window == "undefined") {
      return false;
    }

    if (localStorage.getItem("user")) {
      return JSON.parse(localStorage.getItem("user"));
    } else {
      return false;
    }
  },
  logout: (next) => {
    //delete token
    if (typeof window !== "undefined") localStorage.removeItem("user");
    next();
  },
};
