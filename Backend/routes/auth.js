const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router()


// create a user using POST "/api/auth/createuser", No login required
router.post('/createuser',[
   body('name', 'enter a name').isLength({min: 3}),
   body('email', 'enter a valid email').isEmail(),
   body('password', 'password length should be greater than 5 characters').isLength({min: 5}),

], async (req, res)=>{
   //if there are error return bad request and the error



   // console.log(req.body)
   // const user = User(req.body)
   // user.save()

   const errors = validationResult(req);
   if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() })
   }

   // check weather the user with this email exist already
   let user = await User.findOne({email: req.body.email});
   if (user) {
      return res.status(400).json({error: "Sorry a email with this email already exists"})
   }
 user = await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    })
    
    
   //  .then(user => res.json(user))
   //  .catch(err => {console.log("err")
   //    res.json({error: "please enter a unique value"})})

   // res.send(req.body)
   res.json({user})
})

module.exports = router