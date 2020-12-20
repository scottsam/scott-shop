import axios from "axios";
import {
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_RESET,
  PRODUCT_DETAILS_RESET,
  PRODUCT_TOP_FAIL,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_REQUEST,
  PRODUCT_LIST_RESET,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_CREATE_SUCCESS,
} from "../Constants/productContants";
import { logout } from "./userActions";

export const listProduct = (keyword = "", pageNumber = "") => async (
  dispatch
) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(
      `/products?keyword=${keyword}&page=${pageNumber}`,
      config
    );
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
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
      type: PRODUCT_LIST_FAIL,
      payload: message.msgBody,
    });
  }
};
export const listTopProduct = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(`/product-top`, config);

    dispatch({
      type: PRODUCT_TOP_SUCCESS,
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
      type: PRODUCT_TOP_FAIL,
      payload: message.msgBody,
    });
  }
};

export const listproductDetails = (productId) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(`/product/${productId}`, config);
    const { product } = data;
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: product,
    });
  } catch (err) {
    console.log(err);
    const message =
      err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
    if (message.Error === "true") {
      dispatch(logout());
    }
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: message.msgBody,
    });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });

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

    const { data } = await axios.delete(`/product/${id}`, config);
    const { message } = data;
    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload: err.response.data.message.Error
        ? err.response.data.message.msgBody
        : null,
    });
  }
};
export const createProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });

    const {
      userLogin: {
        userInfo: { AccessToken },
      },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-login-token": `${AccessToken}`,
      },

      body: product,
    };

    const { data } = await axios.post(`/product`, product, config);
    const { message } = data;
    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data.message.msgBody,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload: err.response.data.message.Error
        ? err.response.data.message.msgBody
        : null,
    });
  }
};
export const updateProduct = (product, productId) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: PRODUCT_UPDATE_REQUEST });

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
      body: product,
    };

    const { data } = await axios.put(`/product/${productId}`, product, config);

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data.message.msgBody,
    });
  } catch (err) {
    console.log(err.response);
  }
};
export const createProductReview = (productId, review) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST });

    const {
      userLogin: {
        userInfo: { AccessToken },
      },
    } = getState();
    console.log(AccessToken);

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-login-token": `${AccessToken}`,
        Accept: "application/json",
      },
      body: review,
    };

    const { data } = await axios.post(
      `/product/${productId}/reviews`,
      review,
      config
    );

    dispatch({
      type: PRODUCT_CREATE_REVIEW_SUCCESS,
      payload: data.message.msgBody,
    });
  } catch (err) {
    console.log(err.response.data.message.msgBody);

    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload: err.response.data.message.Error
        ? err.response.data.message.msgBody
        : null,
    });
  }
};
