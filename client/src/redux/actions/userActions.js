import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  SET_USER,
  LOGOUT_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_LOADING_UI,
  STOP_LOADING_UI,
  SET_MESSAGES,
  CLEAR_MESSAGES,
  SET_CURRENT_SECTION,
  SET_CURRENT_ID,
  SET_EXTRA_ID_INFO,
  CLEAR_CURRENT_SECTION_AND_ID,
  REMOVE_MESSAGE,
  REMOVE_ERROR,
} from "./types";

axios.defaults.withCredentials = true;

export const loginUser = (user, history) => (dispatch) => {
  dispatch({ type: SET_LOADING_UI });
  axios
    .post("/api/login", user)
    .then(() => {
      dispatch(getUser(history));
      // dispatch({ type: STOP_LOADING_UI });
    })
    .catch((error) => {
      if (error && error.response && error.response.data === "Unauthorized") {
        dispatch({
          type: SET_ERRORS,
          payload: [
            { id: uuidv4(), type: "error", message: "Wrong Credentials" },
          ],
        });
        dispatch({ type: STOP_LOADING_UI });
      } else {
        setErrors(error.response.data);
        dispatch({ type: STOP_LOADING_UI });
      }
      // dispatch({ type: SET_ERRORS, payload: error.response.data });
    });
};

export const signUpUser = (userData, history) => (dispatch) => {
  dispatch({ type: SET_LOADING_UI });
  axios
    .post("/api/signup", { user: userData })
    .then((response) => {
      history.push("/login");
      dispatch({ type: STOP_LOADING_UI });
      dispatch({ type: SET_MESSAGES, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: STOP_LOADING_UI });
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    });
};

export const logoutUser = (history) => (dispatch) => {
  axios
    .post("/api/logout")
    .then((res) => {
      dispatch({ type: LOGOUT_USER });
      // if (res) {
      // }
      history.push("/login");
    })
    .catch((err) => {
      if (
        err &&
        err.response &&
        err.response.data &&
        Array.isArray(err.response.data)
      ) {
        dispatch({ type: SET_ERRORS, payload: err.response.data });
      }
    });
};

export const setMessages = (messages) => (dispatch) => {
  console.log("Set messages called");

  let newMessages = [];
  messages.forEach((message) => {
    newMessages.push({
      id: uuidv4(),
      type: "success",
      message: message,
    });
  });
  dispatch({ type: SET_MESSAGES, payload: newMessages });
};

export const setErrors = (error) => (dispatch) => {
  let newErrors = [];
  if (
    error &&
    error.response &&
    error.response.data &&
    Array.isArray(error.response.data)
  ) {
    error.response.data.forEach((error) => {
      newErrors.push({
        id: uuidv4(),
        type: "error",
        message: error,
      });
    });
    dispatch({ type: SET_ERRORS, payload: newErrors });
  }
};

export const removeMessage = (messageId) => (dispatch) => {
  dispatch({ type: REMOVE_MESSAGE, payload: messageId });
};

export const removeError = (errorId) => (dispatch) => {
  dispatch({ type: REMOVE_ERROR, payload: errorId });
};

export const getUser = (history) => (dispatch) => {
  dispatch({ type: SET_LOADING_UI });
  axios
    .get("/api/user")
    .then((response) => {
      dispatch({ type: SET_USER, payload: response.data });
      dispatch({ type: STOP_LOADING_UI });
      history.push("/");
    })
    .catch((error) => {
      if (error && error.response && error.response.data) {
        dispatch({ type: STOP_LOADING_UI });
        dispatch({ type: SET_ERRORS, payload: error.response.data });
      }
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
export const clearMessages = () => (dispatch) => {
  dispatch({ type: CLEAR_MESSAGES });
};

export const setCurrentSection = (section) => (dispatch) => {
  dispatch({ type: SET_CURRENT_SECTION, payload: section });
};
export const setCurrentId = (id) => (dispatch) => {
  dispatch({ type: SET_CURRENT_ID, payload: id });
};
export const setExtraIdInfo = (id) => (dispatch) => {
  dispatch({ type: SET_EXTRA_ID_INFO, payload: id });
};
export const clearCurrentSectionAndId = () => (dispatch) => {
  dispatch({ type: CLEAR_CURRENT_SECTION_AND_ID });
};
