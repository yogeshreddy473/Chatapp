import jwt from "jsonwebtoken";

const secureRoute = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    console.log("🚫 No JWT Token Found");
    return res.status(401).json({ error: "Unauthorized, no token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Token Verified:", decoded);
    next();
  } catch (error) {
    console.error("❌ Invalid Token:", error);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default secureRoute;
