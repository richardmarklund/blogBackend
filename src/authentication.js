import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const savedUsername = process.env.API_USERNAME;
const savedPassword = process.env.API_PASSWORD;
const tokenSecret = process.env.API_TOKEN_SECRET;

export const checkAuth = (req, res, next) => {
    if (req.session && req.session.user == savedUsername && req.session.password == savedPassword) {
        next();
    } else {
        return res.sendStatus(401);
    }
};

function generateAccessToken(username) {
    return jwt.sign({ username }, tokenSecret);
}
