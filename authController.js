const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const {secret} = require('./config/config')

const generateAcessToken = (id, roles) => {
   const payload = {
      id,
      roles,
   };
   return jwt.sign(payload, secret, {expiresIn:'24h'})
};

class authController {
   async registration(req, res) {
      try {
         let role = 'USER'
         if (req.headers['secretkey'] == '12345'){
            role = 'ADMIN'
         }
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res
               .status(400)
               .json({ message: 'Validation error', errors });
         }

         const { username, password } = req.body;
         const candidate = await User.findOne({ username });
         if (candidate) {
            return res
               .status(400)
               .json({
                  message:
                     'User with current name is already exist. Please change the name and try again.',
               });
         }

         const salt = bcrypt.genSaltSync(10);
         const hashedPassword = bcrypt.hashSync(password, salt);

         const userRole = await Role.findOne({ value: role });
         const user = new User({
            username,
            password: hashedPassword,
            roles: [userRole.value],
         });
         await user.save();

         return res
            .status(200)
            .json({ message: 'User created comletely: ', user: user });
      } catch (e) {
         console.log(e);
         res.status(400).json({ message: 'registration error' });
      }
   }

   async login(req, res) {
      try {
         const { username, password } = req.body;
         const user = await User.findOne({ username });
         if (!user) {
            res.status(400).json({ message: `User ${username} not found` });
         }

         const validPassword = bcrypt.compareSync(password, user.password);
         if (!validPassword) {
            res.status(400).json({ message: 'Wrong password!' });
         }

         const token = generateAcessToken(user._id, user.roles);
         return res.status(200).json({token: token})
      } catch (e) {
         console.log(e);
         res.status(400).json({ message: 'login error' });
      }
   }

   async getUsers(req, res) {
      try {
         //Uncomment to create roles in database:
         // const userRole = new Role()
         // const adminRole = new Role({value:"ADMIN"})
         // await userRole.save()
         // await adminRole.save()

         const users = await User.find({})

         res.status(200).json({ users: users });
      } catch (e) {
         console.log(e);
         res.status(400).json({ message: e });
      }
   }
}

module.exports = new authController();
