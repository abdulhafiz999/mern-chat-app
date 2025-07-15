
//importing the necessary modules
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const generateJWT = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

export default generateJWT;
