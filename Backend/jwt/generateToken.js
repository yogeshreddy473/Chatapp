import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  console.log("Generated JWT Token:", token); // Debugging

  res.cookie("jwt", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Secure cookie in production
    sameSite: "strict", // Prevents CSRF attacks
  });
};

export default createTokenAndSaveCookie;
