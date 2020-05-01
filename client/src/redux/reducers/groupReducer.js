import { SET_GROUPS, SET_GROUP_UPDATED } from '../actions/types';

const initialState = {
  groups: [],
  groupUpdated: false,
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUPS:
      return {
        ...state,
        groups: action.payload,
      };
    case SET_GROUP_UPDATED:
      return {
        ...state,
        groupUpdated: action.payload,
      };
    default:
      return state;
  }
};

export default groupReducer;
