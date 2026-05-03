const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    
    // If no authorization header or invalid format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "Auth Token is required in the correct format (Bearer <token>)",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    // Verifying the token
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          message: "Auth Failed",
          success: false,
        });
      }

      req.user = decode;  // Store decoded user data in the request
      next();  // Proceed to the next middleware or route handler
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).send({
      message: "Auth Failed due to an unexpected error",
      success: false,
    });
  }
};
