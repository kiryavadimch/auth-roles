const Router = require('express');
const router = new Router();
const controller = require('./authController');
const { check } = require('express-validator');
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post(
   '/registration',
   [
      check('username', 'Empty user name!').notEmpty(),
      check('password', 'Password must be longer than 7 and less than 312').isLength({min:8, max: 312}),
   ],
   controller.registration
);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers);

module.exports = router;
