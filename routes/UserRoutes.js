const router = require("express").Router();

//Image Upload
const { imageUpload } = require("../util/imageUpload");

//passport
const passport = require("passport");
const passportConfig = require("../passport");

//controllers
//User Controller Imports
const {
  login,
  signUp,
  logout,
  getUser,
  editProfile,
} = require("../controller/userController");

//Team Controller Imports
const {
  createTeam,
  deleteTeam,
  leaveTeam,
  joinTeam,
  getTeam,
  getTeams,
  getArchivedTeamProjects,
  getTeamManagementInfo,
  getTeamWithProjects,
} = require("../controller/teamController");

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
  getProjectsForTeam,
} = require("../controller/projectController");

//Issue Controller Imports
const {
  createIssue,
  editIssue,
  editIssueStatus,
  deleteIssue,
  getIssue,
} = require("../controller/issueController");

//Comment Controller Imports
const {
  createComment,
  editComment,
  deleteComment,
} = require("../controller/commentController");

//Chat Controller Imports
const { getChats } = require("../controller/chatController");

//Auth Controller Imports
const { refreshToken } = require("../controller/authController");

const passportLocal = passport.authenticate("local", { session: true });
const passportJWT = passport.authenticate("jwt", { session: true });

//User Routes
router.post("/login", passportLocal, login);
router.post("/signup", signUp);
router.post("/logout", logout);
router.get("/user", passportJWT, getUser);
router.put(
  "/edit-profile",
  passportJWT,
  imageUpload.single("profilePicture"),
  editProfile
);

//Team Routes
// router.get('/projectsFromTeam/:teamId', passportJWT, getProjectsFromTeam);
router.post("/team", passportJWT, createTeam);
router.get("/teams", passportJWT, getTeams);
router.get("/team/:teamId", passportJWT, getTeam);
router.get("/team/projects/:teamId", passportJWT, getTeamWithProjects);
router.get("/team/management/:teamId", passportJWT, getTeamManagementInfo);
router.put("/leave/team/:teamId", passportJWT, leaveTeam);
router.delete("/team/:teamId", passportJWT, deleteTeam);
router.post("/join/team", passportJWT, joinTeam);
router.get(
  "/team/:teamId/projects/archived",
  passportJWT,
  getArchivedTeamProjects
);

//Project Routes
router.get("/project/:projectId", passportJWT, getProject);
router.get("/projects", passportJWT, getProjects);
router.get("/projects/archived", passportJWT, getArchivedProjects);
router.post("/project", passportJWT, createProject);
router.post("/project/:projectId/label/create", passportJWT, addLabel);
router.delete("/project/:projectId/label/:labelId", passportJWT, deleteLabel);
router.put("/project/:projectId/label/:labelId/edit", passportJWT, editLabel);
router.put("/project/:projectId/archive/add", passportJWT, addToArchive);
router.put(
  "/project/:projectId/archive/remove",
  passportJWT,
  removeFromArchive
);
router.put("/project/:projectId", passportJWT, editProject);
router.delete("/project/:projectId", passportJWT, deleteProject);

//Issue Routes
router.get("/issue/:issueId", passportJWT, getIssue);
router.post("/issue", passportJWT, createIssue);
router.put("/issue/:issueId", passportJWT, editIssue);
router.put("/issue/:issueId/status", passportJWT, editIssueStatus);
router.delete("/issue/:issueId", passportJWT, deleteIssue);

router.post("/comment", passportJWT, createComment);
router.put("/comment/:commentId", passportJWT, editComment);
router.delete("/comment/:commentId", passportJWT, deleteComment);

//Chat
router.get("/chats/:teamID", passportJWT, getChats);
// router.get('/chats', passportJWT, getChats);

//Auth
router.post("/token", refreshToken);
module.exports = router;
