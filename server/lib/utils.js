import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    "haribolli",
    { expiresIn: "7d" } // token expires in 7 days
  );
};
