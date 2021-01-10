const { verifyToken } = require("../util/authUtil");

module.exports = {
  refreshToken: (req, res) => {
    const refreshToken = req.cookies["jwtIssRef"];
    const user = req.body.user;

    if (refreshToken === null) return res.sendStatus(401);
    if (user === null || Object.keys(user).length <= 0)
      return res.sendStatus(401);

    try {
      const accessToken = verifyToken(refreshToken, user);
      res.status(200).clearCookie("jwtIss");
      res
        .status(200)
        .cookie("jwtIss", accessToken, {
          sameSite: "strict",
          path: "/",
          httpOnly: true,
        })
        .send("Returning cookie");
    } catch (err) {
      res.sendStatus(401);
    }
  },
};
