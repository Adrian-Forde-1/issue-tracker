import {
  SET_CHATS,
  RESET_CHATS,
  ADD_NEW_CHAT_MESSAGE,
  SET_CURRENT_CHAT_TEAM_ID,
} from '../actions/types';

const initialState = {
  chats: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHATS:
      return { ...state, chats: action.payload };
    case RESET_CHATS:
      return { ...state, chats: [] };
    case ADD_NEW_CHAT_MESSAGE:
      return { ...state, chats: state.chats.concat(action.payload) };
    default:
      return state;
  }
};

export default chatReducer;
