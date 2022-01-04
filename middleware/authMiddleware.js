const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');

module.exports = function (req, res, next) {
   if (req.method === 'OPTIONS') {
      next();
   }

   try {
      token = req.headers.authorization.split(' ')[1];
      if (!token) {
         res.status(403).json({ message: 'User is not logged in' });
      }

      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
   } catch (e) {
      console.log(e);
      res.status(403).json({ message: 'User is not logged in' });
   }
};
