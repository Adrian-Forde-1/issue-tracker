const router = require('express').Router();

//passport
const passport = require('passport');
const passportConfig = require('../passport');

//controllers
//User Controller Imports
const { login, signUp, getUser } = require('../controller/userController');

//Group Controller Imports
const {
  createGroup,
  deleteGroup,
  leaveGroup,
  joinGroup,
  getGroup,
  getGroups,
  getArchivedGroupProjects,
} = require('../controller/groupController');

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

//Note Controller Imports
const {
  createNote,
  editNote,
  deleteNote,
} = require('../controller/noteController');

const passportLocal = passport.authenticate('local', { session: true });
const passportJWT = passport.authenticate('jwt', { session: true });

//User Routes
router.post('/login', passportLocal, login);
router.post('/signup', signUp);
router.get('/user', passportJWT, getUser);

//Group Routes
// router.get('/projectsFromGroup/:groupId', passportJWT, getProjectsFromGroup);
router.get('/group/:groupId', passportJWT, getGroup);
router.get('/groups', passportJWT, getGroups);
router.get(
  '/group/:groupId/projects/archived',
  passportJWT,
  getArchivedGroupProjects
);
router.post('/group', passportJWT, createGroup);
router.put('/leave/group/:groupId', passportJWT, leaveGroup);
router.delete('/group/:groupId', passportJWT, deleteGroup);
router.post('/join/group', passportJWT, joinGroup);

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

router.post('/note', passportJWT, createNote);
router.put('/note/:noteId', passportJWT, editNote);
router.delete('/note/:noteId', passportJWT, deleteNote);
module.exports = router;
