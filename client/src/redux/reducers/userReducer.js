import {
  SET_USER,
  LOGOUT_USER,
  SET_MESSAGES,
  CLEAR_MESSAGES,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_CURRENT_SECTION,
  SET_CURRENT_ID,
  CLEAR_CURRENT_SECTION_AND_ID,
  SET_EXTRA_ID_INFO,
  REMOVE_MESSAGE,
  REMOVE_ERROR,
} from "../actions/types";

const initialState = {
  user: {},
  errors: [],
  messages: [],
  authenticated: false,
  currentSection: "",
  currentId: "",
  extraIdInfo: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        errors: [],
        messages: [],
        authenticated: true,
        user: action.payload,
      };
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    case REMOVE_MESSAGE:
      let newMesssges = state.messages.filter(
        (message) => message.id.toString() !== action.payload.toString()
      );
      return {
        ...state,
        messages: newMesssges,
      };
    case REMOVE_ERROR:
      let newErrors = state.errors.filter(
        (error) => error.id.toString() !== action.payload.toString()
      );
      return {
        ...state,
        errors: newErrors,
      };
    case SET_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        errors: [],
      };
    case SET_CURRENT_SECTION:
      return {
        ...state,
        currentSection: action.payload,
      };
    case SET_CURRENT_ID:
      return {
        ...state,
        currentId: action.payload,
      };
    case SET_EXTRA_ID_INFO:
      return {
        ...state,
        extraIdInfo: action.payload,
      };
    case CLEAR_CURRENT_SECTION_AND_ID:
      return {
        ...state,
        currentSection: "",
        currentId: "",
        extraIdInfo: "",
      };

    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
