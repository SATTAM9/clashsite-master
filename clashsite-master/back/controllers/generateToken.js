const jwt = require("jsonwebtoken");

exports.accessToken = (user) =>
  jwt.sign(
    {
      userInfo: {
        id: user._id,
        role: user.role,
        name: user.first_name,
        email: user.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

exports.refreshToken = (user) =>
  jwt.sign(
    {
      userInfo: {
        id: user._id,
        role: user.role,
        name: user.first_name,
        email: user.email,
      },
    },
    process.env.REFREESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
