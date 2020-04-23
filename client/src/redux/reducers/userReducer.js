import {
  SET_USER,
  LOGOUT_USER,
  SET_MESSAGES,
  CLEAR_MESSAGES,
  SET_ERRORS,
  CLEAR_ERRORS,
} from '../actions/types';

const initialState = {
  user: null,
  errors: {},
  messages: {},
  authenticated: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        errors: {},
        messages: {},
        authenticated: true,
        user: action.payload,
      };
    case SET_MESSAGES:
      return {
        ...state,
        errors: {},
        messages: action.payload,
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
        messages: {},
      };
    case SET_ERRORS:
      return {
        ...state,
        messages: {},
        errors: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        errors: {},
      };
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
