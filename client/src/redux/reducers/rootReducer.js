import { combineReducers } from 'redux';
import userReducer from './userReducer';
import projectReducer from './projectReducer';
import teamReducer from './teamReducer';
import modalReducer from './modalReducer';

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectReducer,
  teams: teamReducer,
  modal: modalReducer,
});

export default rootReducer;
