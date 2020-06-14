import {
  SET_SHOW_MODAL,
  SET_CLOSE_MODAL,
  SET_DELETE_ITEM,
  REMOVE_DELETE_ITEM,
  SET_ITEM_TYPE,
  REMOVE_ITEM_TYPE,
  SET_CURRENT_LOCATION,
  REMOVE_CURRENT_LOCATION,
} from './types';

export const showModal = () => (dispatch) => {
  dispatch({ type: SET_SHOW_MODAL });
};

export const closeModal = () => (dispatch) => {
  dispatch({ type: SET_CLOSE_MODAL });
};

export const setDeleteItem = (item) => (dispatch) => {
  dispatch({ type: SET_DELETE_ITEM, payload: item });
};

export const removeDeleteItem = () => (dispatch) => {
  dispatch({ type: REMOVE_DELETE_ITEM });
};

export const setItemType = (type) => (dispatch) => {
  dispatch({ type: SET_ITEM_TYPE, payload: type });
};

export const removeItemType = () => (dispatch) => {
  dispatch({ type: REMOVE_ITEM_TYPE });
};

export const setCurrentLocation = (location) => (dispatch) => {
  dispatch({ type: SET_CURRENT_LOCATION, payload: location });
};

export const removeCurrentLocation = () => (dispatch) => {
  dispatch({ type: REMOVE_CURRENT_LOCATION });
};
