import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const savedUsername = process.env.API_USERNAME;
const savedPassword = process.env.API_PASSWORD;
const tokenSecret = process.env.API_TOKEN_SECRET;

export const checkAuth = (username, password) => {
  if (username == savedUsername && password == savedPassword) {
    return {
      isLoggedIn: true,
      token: generateAccessToken(username),
    };
  } else {
    return {
      isLoggedIn: false,
      token: null,
    };
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token)

  jwt.verify(token, process.env.API_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

function generateAccessToken(username) {
    return jwt.sign({ username }, tokenSecret);
}
