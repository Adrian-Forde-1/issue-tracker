import { SET_TEAMS, SET_TEAM_UPDATED } from '../actions/types';

const initialState = {
  teams: [],
  teamUpdated: false,
};

const teamReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEAMS:
      return {
        ...state,
        teams: action.payload,
      };
    case SET_TEAM_UPDATED:
      return {
        ...state,
        teamUpdated: action.payload,
      };
    default:
      return state;
  }
};

export default teamReducer;
