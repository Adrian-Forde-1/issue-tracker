import { combineReducers } from 'redux';
import userReducer from './userReducer';
import projectReducer from './projectReducer';
import teamReducer from './teamReducer';

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectReducer,
  teams: teamReducer,
});

export default rootReducer;
