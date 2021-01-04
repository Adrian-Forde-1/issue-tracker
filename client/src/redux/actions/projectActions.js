import { SET_PROJECTS, SET_ERRORS, SET_PROJECT_UPDATED } from "./types";
import axios from "axios";

export const getUserProjects = (userId) => async (dispatch) => {
  axios
    .get("/api/projects")
    .then((response) => {
      dispatch({ type: SET_PROJECTS, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    });
};

export const setProjects = (projects) => async (dispatch) => {
  dispatch({ type: SET_PROJECTS, payload: projects });
};

export const setProjectUpdated = (bool) => (dispatch) => {
  dispatch({ type: SET_PROJECT_UPDATED, payload: bool });
};
