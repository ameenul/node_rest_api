//const jwt = require('jsonwebtoken');
// const verifyToken = (req, res, next) => {

//     const token = req.headers['authorization'];
//     if (!token) {
//         return res.status(403).json({ message: 'No token provided!' });
//     }
//     const tokenParts = token.split(" ");
//     if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
//         return res.status(403).json({ message: 'invalid Token Format' });
//     }
//     jwt.verify(token, process.env.jwt_secret_key, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Unauthorized!' });
//         }
//         req.user = decoded.id;
//         next();
//     });

// };

// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];    // e.g. "Bearer eyJ..."
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(403).json({ message: 'Invalid token format' });
  }

  const token = parts[1];   // hanya token-nya saja
  jwt.verify(token, process.env.jwt_secret_key, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized!' });
    }
    // decoded biasanya berisi payload seperti { id: 1, iat: ..., exp: ... }
    req.user = decoded;      
    next();
  });
};


module.exports = verifyToken;
