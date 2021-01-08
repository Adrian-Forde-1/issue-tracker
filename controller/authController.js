const { verifyToken } = require("../util/authUtil");

module.exports = {
  refreshToken: (req, res) => {
    const refreshToken = req.cookies["jwtIssRef"];
    if (refreshToken === null) return res.sendStatus(401);
    const accessToken = verifyToken(refreshToken, req.user);
    res.status(200).clearCookie("jwtIss");
    res
      .status(200)
      .cookie("jwtIss", accessToken, {
        sameSite: "strict",
        path: "/",
        httpOnly: true,
      })
      .send("Returning cookie");
  },
};
