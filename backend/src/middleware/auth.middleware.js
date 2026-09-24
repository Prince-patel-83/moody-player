const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {

   const token  = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is required.",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedToken.userId;
 
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = protect;