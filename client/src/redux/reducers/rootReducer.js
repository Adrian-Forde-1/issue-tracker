import { combineReducers } from 'redux';
import userReducer from './userReducer';
import projectReducer from './projectReducer';
import groupReducer from './groupReducer';

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectReducer,
  groups: groupReducer,
});

export default rootReducer;
