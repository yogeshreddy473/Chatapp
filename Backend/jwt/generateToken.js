import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing in .env file");
    throw new Error("Missing JWT_SECRET environment variable");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
  });
};

export default createTokenAndSaveCookie;
