import {
  SET_CHATS,
  RESET_CHATS,
  ADD_NEW_CHAT_MESSAGE,
  SET_CURRENT_CHAT_TEAM_ID,
} from "../actions/types";
import { setErrors } from "./userActions";
import axios from "axios";

export const getChats = (teamID) => async (dispatch) => {
  axios
    .get(`/api/chats/${teamID}`)
    .then((response) => {
      dispatch({ type: SET_CHATS, payload: response.data });
    })
    .catch((err) => {
      setErrors(err);
    });
};

export const afterPostingMessage = (message) => (dispatch) => {
  dispatch({ type: ADD_NEW_CHAT_MESSAGE, payload: message });
};

export const resetChats = () => (dispatch) => {
  dispatch({ type: RESET_CHATS });
};
