const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
      }
      
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.user = payload; 
      req.token = token;
      next();
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  };

  module.exports = verifyToken;
  