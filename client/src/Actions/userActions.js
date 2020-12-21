import axios from "axios";
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_RESET,
  USER_LIST_FAIL,
  USER_LIST_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_UPDATE_FAIL,
} from "../Constants/userConstant";
import { ORDER_LIST_MY_RESET } from "../Constants/orderConstants";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/user/login",
      { email, password },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (err) {
    console.log(err.response);
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: err.response.data.message.Error
        ? err.response.data.message.msgBody
        : null,
    });
  }
};

export const register = (name, password, email, phone) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/user/register",
      { name, password, email, phone },
      config
    );

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: {
        msg: data.message.msgBody,
        user: data.user,
      },
    });
  } catch (err) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: err.response.data.message.Error
        ? err.response.data.message.msgBody
        : null,
    });
  }
};

export const getUserdetails = (userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const {
      userLogin: {
        userInfo: { AccessToken },
      },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-login-token": `${AccessToken}`,
      },
    };
    const { data } = await axios.get(`/user/${userId}`, config);
    const { user } = data;

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    const message = err.response.data.message.Error
      ? err.response.data.message.msgBody
      : null;

    if (message) {
      dispatch(logout());
    }
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: message,
    });
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });
    const {
      userLogin: {
        userInfo: { AccessToken },
      },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-login-token": `${AccessToken}`,
      },
      body: user,
    };
    const { data } = await axios.put(`/user/${user._id}`, user, config);

    dispatch({
      type: USER_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    const message =
      err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
    if (message.Error === "true") {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: message.msgBody,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });
    const {
      userLogin: {
        userInfo: { AccessToken },
      },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-login-token": `${AccessToken}`,
      },
      body: user,
    };
    const { data } = await axios.put(`/user/profile`, user, config);

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    const message =
      err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
    if (message.Error === "true") {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: message,
    });
  }
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });
    const {
      userLogin: {
        userInfo: { AccessToken },
      },
    } = getState();
    const config = {
      headers: {
        "x-login-token": `${AccessToken}`,
      },
    };
    const { data } = await axios.delete(`/user/${id}`, config);

    dispatch({
      type: USER_DELETE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    console.log(err.response);
    const message = err.response.data.message.Error
      ? err.response.data.message.msgBody
      : null;

    if (message) {
      dispatch(logout());
    }
    dispatch({
      type: USER_DELETE_FAIL,
      payload: message.msgBody,
    });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const {
      userLogin: {
        userInfo: { AccessToken },
      },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-login-token": `${AccessToken}`,
      },
    };
    const { data } = await axios.get(`/user/users`, config);

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data.users,
    });
  } catch (err) {
    console.log(err.response);
    const message = err.response.data.message.Error
      ? err.response.data.message.msgBody
      : null;

    if (message.Error === "true") {
      dispatch(logout());
    }
    dispatch({
      type: USER_LIST_FAIL,
      payload: message.msgBody,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("shippingAddress");
  localStorage.removeItem("paymentAddress");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: USER_LIST_RESET });
  document.location.href = "/login";
};
