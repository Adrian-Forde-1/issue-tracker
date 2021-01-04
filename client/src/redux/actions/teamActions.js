import { SET_TEAMS, SET_ERRORS, SET_TEAM_UPDATED } from "./types";
import axios from "axios";

export const getUserTeams = (userId) => async (dispatch) => {
  axios
    .get("/api/teams")
    .then((response) => {
      return dispatch({ type: SET_TEAMS, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    });
};

export const setTeamUpdated = (bool) => (dispatch) => {
  dispatch({ type: SET_TEAM_UPDATED, payload: bool });
};
