import axios from "axios";
import {
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
} from "../Constants/orderConstants";
import { logout } from "./userActions";

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });
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
      body: order,
    };

    const { data } = await axios.post(`/order`, order, config);
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: err.response.data.message.Error
        ? err.response.data.message.msgBody
        : null,
    });
  }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

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

    const { data } = await axios.get(`/order/${id}`, config);
    const { message } = data;
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: err.response.data.message.Error
        ? err.response.data.message.msgBody
        : null,
    });
    dispatch(logout());
  }
};
export const payOrder = (orderId, paymentResult) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST });

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

    const { data } = await axios.post(
      `/orders/${orderId}`,
      paymentResult,
      config
    );
    const { message } = data;
    dispatch({
      type: ORDER_PAY_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload: err.response.data.message.Error
        ? err.response.data.message.msgBody
        : null,
    });
    dispatch(logout());
  }
};
export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DELIVER_REQUEST });

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

    const { data } = await axios.put(`/order/${order._id}/deliver`, {}, config);
    const { message } = data;
    dispatch({
      type: ORDER_DELIVER_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload: err.response.data.message.Error
        ? err.response.data.message.msgBody
        : null,
    });
    dispatch(logout());
  }
};
export const listMyOrders = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_MY_REQUEST });

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

    const { data } = await axios.get(
      `/order/myorders/${id}`,

      config
    );

    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload: err.response.message.Error ? err.response.message.msgBody : null,
    });
    dispatch(logout());
  }
};
export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });

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

    const { data } = await axios.get(
      `/orders`,

      config
    );
    const { message } = data;
    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload: err.response.data.message.Error
        ? err.response.data.message.msgBody
        : null,
    });
    dispatch(logout());
  }
};
