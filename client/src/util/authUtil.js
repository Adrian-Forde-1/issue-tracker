import axios from "axios";
import store from "../redux/store";

import { LOGOUT_USER, SET_ERRORS } from "../redux/actions/types";

export const refreshToken = async (history) => {
  let newToken = false;
  await axios
    .post("/api/token")
    .then((res) => {
      newToken = true;
    })
    .catch((err) => {
      logoutUser(history);
    });

  return newToken;
};

export const logoutUser = (history) => {
  axios
    .post("/api/logout")
    .then((res) => {
      if (res) {
        store.dispatch({ type: LOGOUT_USER });
        history.push("/login");
      }
    })
    .catch((err) => {
      if (err && err.response && err.response.data) {
        store.dispatch({ type: SET_ERRORS, payload: err.response.data });
      }
    });
};
