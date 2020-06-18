const router = require('express').Router();

//passport
const passport = require('passport');
const passportConfig = require('../passport');

//controllers
//User Controller Imports
const { login, signUp, getUser } = require('../controller/userController');

//Team Controller Imports
const {
  createTeam,
  deleteTeam,
  leaveTeam,
  joinTeam,
  getTeam,
  getTeams,
  getArchivedTeamProjects,
} = require('../controller/teamController');

//Project Controller Imports
const {
  createProject,
  deleteProject,
  editProject,
  getProject,
  getProjects,
  addLabel,
  deleteLabel,
  editLabel,
  addToArchive,
  removeFromArchive,
  getArchivedProjects,
} = require('../controller/projectController');

//Bug Controller Imports
const {
  createBug,
  deleteBug,
  editBug,
  editBugStatus,
  getBug,
} = require('../controller/bugController');

//Comment Controller Imports
const {
  createComment,
  editComment,
  deleteComment,
} = require('../controller/commentController');

//Chat Controller Imports
const { getChats } = require('../controller/chatController');

const passportLocal = passport.authenticate('local', { session: true });
const passportJWT = passport.authenticate('jwt', { session: true });

//User Routes
router.post('/login', passportLocal, login);
router.post('/signup', signUp);
router.get('/user', passportJWT, getUser);

//Team Routes
// router.get('/projectsFromTeam/:teamId', passportJWT, getProjectsFromTeam);
router.get('/team/:teamId', passportJWT, getTeam);
router.get('/teams', passportJWT, getTeams);
router.get(
  '/team/:teamId/projects/archived',
  passportJWT,
  getArchivedTeamProjects
);
router.post('/team', passportJWT, createTeam);
router.put('/leave/team/:teamId', passportJWT, leaveTeam);
router.delete('/team/:teamId', passportJWT, deleteTeam);
router.post('/join/team', passportJWT, joinTeam);

//Project Routes
router.get('/project/:projectId', passportJWT, getProject);
router.get('/projects', passportJWT, getProjects);
router.get('/projects/archived', passportJWT, getArchivedProjects);
router.post('/project', passportJWT, createProject);
router.post('/project/:projectId/label/create', passportJWT, addLabel);
router.delete('/project/:projectId/label/:labelId', passportJWT, deleteLabel);
router.put('/project/:projectId/label/:labelId/edit', passportJWT, editLabel);
router.put('/project/:projectId/archive/add', passportJWT, addToArchive);
router.put(
  '/project/:projectId/archive/remove',
  passportJWT,
  removeFromArchive
);
router.put('/project/:projectId', passportJWT, editProject);
router.delete('/project/:projectId', passportJWT, deleteProject);

//Bug Routes
router.get('/bug/:bugId', passportJWT, getBug);
router.post('/bug', passportJWT, createBug);
router.put('/bug/:bugId', passportJWT, editBug);
router.put('/bug/:bugId/status', passportJWT, editBugStatus);
router.delete('/bug/:bugId', passportJWT, deleteBug);

router.post('/comment', passportJWT, createComment);
router.put('/comment/:commentId', passportJWT, editComment);
router.delete('/comment/:commentId', passportJWT, deleteComment);

//Chat
router.get('/chats/:teamID', passportJWT, getChats);
// router.get('/chats', passportJWT, getChats);
module.exports = router;
