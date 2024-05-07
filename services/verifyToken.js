const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verify = (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"] ||
      req.headers.authorization;
    console.log(token);
    // Express headers are auto converted to lowercase
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not provided" });
    }
    const user = jwt.verify(token, process.env.jwtSecret);
    
    User.findOne({ where: { id: user.userId } })
      .then((foundUser) => {
        if (foundUser) {
          req.user = user;
          next();
        } else {
          return res
            .status(401)
            .json({ success: false, message: "User not found" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "An error occurred while fetching the user",
        });
      });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ success: false, message: "Token verification failed" });
  }
};

module.exports = { verify };
