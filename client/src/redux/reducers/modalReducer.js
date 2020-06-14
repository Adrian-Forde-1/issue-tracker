import {
  SET_SHOW_MODAL,
  SET_CLOSE_MODAL,
  SET_DELETE_ITEM,
  REMOVE_DELETE_ITEM,
  SET_ITEM_TYPE,
  REMOVE_ITEM_TYPE,
  SET_CURRENT_LOCATION,
  REMOVE_CURRENT_LOCATION,
} from '../actions/types';

const initialState = {
  showModal: false,
  deleteItem: {},
  itemType: '',
  currentLocation: '',
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SHOW_MODAL:
      return { ...state, showModal: true };
    case SET_CLOSE_MODAL:
      return { ...state, showModal: false };
    case SET_DELETE_ITEM:
      return { ...state, deleteItem: action.payload };
    case REMOVE_DELETE_ITEM:
      return { ...state, deleteItem: {} };
    case SET_ITEM_TYPE:
      return { ...state, itemType: action.payload };
    case REMOVE_ITEM_TYPE:
      return { ...state, itemType: '' };
    case SET_CURRENT_LOCATION:
      return { ...state, currentLocation: action.payload };
    case REMOVE_CURRENT_LOCATION:
      return { ...state, currentLocation: '' };

    default:
      return state;
  }
};

export default modalReducer;
