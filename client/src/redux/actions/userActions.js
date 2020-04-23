import axios from 'axios';
import {
  SET_USER,
  LOGOUT_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_LOADING_UI,
  STOP_LOADING_UI,
  SET_MESSAGES,
  CLEAR_MESSAGES,
} from './types';

export const loginUser = (user, history) => (dispatch) => {
  dispatch({ type: CLEAR_MESSAGES });
  dispatch({ type: CLEAR_ERRORS });
  dispatch({ type: SET_LOADING_UI });
  axios
    .post('/api/login', user)
    .then((response) => {
      localStorage.setItem('token', `Bearer ${response.data.token}`);
    })
    .then(() => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch(getUser(history));
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((error) => {
      if (error.response.data === 'Unauthorized') {
        dispatch({
          type: SET_ERRORS,
          payload: { general: 'Wrong Credentials' },
        });
        dispatch({ type: STOP_LOADING_UI });
      } else {
        dispatch({
          type: SET_ERRORS,
          payload: error.response,
        });
        dispatch({ type: STOP_LOADING_UI });
      }
      // dispatch({ type: SET_ERRORS, payload: error.response.data });
    });
};

export const signUpUser = (userData, history) => (dispatch) => {
  dispatch({ type: CLEAR_MESSAGES });
  dispatch({ type: CLEAR_ERRORS });
  dispatch({ type: SET_LOADING_UI });
  axios
    .post('/api/signup', { user: userData })
    .then((response) => {
      history.push('/login');
      dispatch({ type: STOP_LOADING_UI });
      dispatch({ type: SET_MESSAGES, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: STOP_LOADING_UI });
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    });
};

export const logoutUser = (history) => (dispatch) => {
  dispatch({ type: CLEAR_MESSAGES });
  dispatch({ type: CLEAR_ERRORS });
  dispatch({ type: LOGOUT_USER });
  localStorage.removeItem('token');
  history.push('/login');
};

export const setErrors = (error) => (dispatch) => {
  dispatch({ type: SET_ERRORS, payload: error.response.data });
};

const getUser = (history) => (dispatch) => {
  dispatch({ type: CLEAR_MESSAGES });
  dispatch({ type: CLEAR_ERRORS });
  dispatch({ type: SET_LOADING_UI });
  axios
    .get('/api/user', {
      headers: { Authorization: localStorage.getItem('token') },
    })
    .then((response) => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_USER, payload: response.data });
      dispatch({ type: STOP_LOADING_UI });
      history.push('/manager');
    })
    .catch((error) => {
      dispatch({ type: STOP_LOADING_UI });
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
export const clearMessages = () => (dispatch) => {
  dispatch({ type: CLEAR_MESSAGES });
};
