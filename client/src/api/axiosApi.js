import axios from "axios";

//Util
import { refreshToken } from "../util/authUtil";

//Redux Store
import store from "../redux/store";

//Actio Types
import { SET_ERRORS } from "../redux/actions/types";

export const apiGet = async (route, history, cb) => {
  let response; //Variable to store the data returned from the api

  //Calls the api using the route that was passed in
  await axios
    .get(route)
    .then((res) => {
      response = res; //Stores the returned data in the variable response
    })
    .catch(async (err) => {
      if (err && err.response && err.response.data) {
        if (err.response.status === 401) {
          //If the status code is 401, create a new auth token
          const refreshed = await refreshToken(history); // Create new auth token

          //If the auth token was successfully created, call the function that was passed in again
          //This function is usually the function that calls this function that will try to fetch the
          //data again with the new auth token
          if (refreshed) cb();
        } else store.dispatch({ type: SET_ERRORS, payload: err.response.data });
      }
    });
  return response;
};
