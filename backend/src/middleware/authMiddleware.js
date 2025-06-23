const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
      // If the user is logged in, allow the request
      next();
    } else {
      // Otherwise, block the request
      res.status(401).json({ message: "Unauthorized. Please log in." });
    }
  };
  
  export default authMiddleware;