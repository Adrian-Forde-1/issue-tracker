import { SET_PROJECTS, SET_PROJECT_UPDATED } from '../actions/types';

const initialState = {
  projects: [],
  projectUpdated: false,
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
      };

    case SET_PROJECT_UPDATED:
      return {
        ...state,
        projectUpdated: action.payload,
      };

    default:
      return state;
  }
};

export default projectReducer;
