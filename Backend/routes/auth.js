const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = "irtazaisagoodbo$y"
// create a user using POST "/api/auth/createuser", No login required
router.post('/createuser', [
   body('name', 'enter a name').isLength({ min: 3 }),
   body('email', 'enter a valid email').isEmail(),
   body('password', 'password length should be greater than 5 characters').isLength({ min: 5 }),

], async (req, res) => {
   //if there are error return bad request and the error



   // console.log(req.body)
   // const user = User(req.body)
   // user.save()

   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   try {


      // check weather the user with this email exist already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
         return res.status(400).json({ error: "Sorry a email with this email already exists" })
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt)

      user = await User.create({
         name: req.body.name,
         password: secPass,
         email: req.body.email,
      })
      const data = {
         user:{

            id: user.id
         }
      }
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken })

      
   } catch (error) {
      console.log(error.message)
      res.status(500).send("Internal Server error");
   }

})


// authenticate a user using POST "/api/auth/login", No login required

router.post('/login', [
 
   body('email', 'enter a valid email').isEmail(),
   body('password', 'password cannot be blank').exists(),

], async (req, res) => {

   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const {email, password} = req.body
   try{
      let user = await User.findOne({email})
      if(!user) {
         return res.status(400).json({error: "Please try to login with correct credentials"})
      }

      const passwordCompare = await bcrypt.compare(password, user.password)
      if (!passwordCompare) {
         return res.status(400).json({error: "Please try to login with correct credentials"})

      }

      const data = {
         user:{

            id: user.id
         }
      }
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken })


   } catch (error) {
      console.log(error.message)
      res.status(500).send("Internal Server error");
   }


})





module.exports = router