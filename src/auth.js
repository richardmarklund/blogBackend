import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
      const decoded = jwt.verify(token, process.env.API_TOKEN_SECRET);
    req.user = decoded;
  } catch (err) {
      console.log(err)
    return res.status(401).send("Invalid Token");
  }
  return next();
};
export { verifyToken };
