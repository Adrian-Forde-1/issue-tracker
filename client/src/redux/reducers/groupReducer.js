import { SET_GROUPS } from '../actions/types';

const initialState = {
  groups: [],
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUPS:
      return {
        groups: action.payload,
      };

    default:
      return state;
  }
};

export default groupReducer;
