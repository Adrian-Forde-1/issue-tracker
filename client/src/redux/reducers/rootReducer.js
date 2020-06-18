import { combineReducers } from 'redux';
import userReducer from './userReducer';
import projectReducer from './projectReducer';
import teamReducer from './teamReducer';
import modalReducer from './modalReducer';
import chatReducer from './chatReducer';

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectReducer,
  teams: teamReducer,
  modal: modalReducer,
  chat: chatReducer,
});

export default rootReducer;
