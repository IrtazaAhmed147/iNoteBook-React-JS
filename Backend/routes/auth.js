const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router()



router.post('/',[
   body('name', 'enter a name').isLength({min: 3}),
   body('email', 'enter a valid email').isEmail(),
   body('password').isLength({min: 5}),

], (req, res)=>{
   // console.log(req.body)
   // const user = User(req.body)
   // user.save()

   const errors = validationResult(req);
   if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() })
   }
   User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    }).then(user => res.json(user));

   // res.send(req.body)
})

module.exports = router