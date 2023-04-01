const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "test";

const generateToken = async (email, password) => {
  const token = await jwt.sign({ email, password }, secretKey);
  console.log("token", token);
  return token;
};

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("authHeader", authHeader);
  const token = authHeader;

  if (!token) {
    console.log("token", token);
    return res.status(400).send("unauthorized");
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send("Not valid token");
    }
    req.user = user;
    next();
  });
};

module.exports = { generateToken, validateToken };
