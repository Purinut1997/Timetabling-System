const jwt = require("jsonwebtoken");

function getBearerToken(event) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length);
}

function verifyTokenFromEvent(event) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  const token = getBearerToken(event);
  if (!token) {
    throw new Error("Missing bearer token");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { verifyTokenFromEvent };
