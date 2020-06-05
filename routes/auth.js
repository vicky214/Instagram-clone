const express = require('express');
const router = express.Router();
var app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
var bodyParser = require('body-parser')
const {JWT_SECRET} = require('../config/key')
const User = mongoose.model('User')
const requireLogin = require('../middleware/requireLogin')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body 
    if(!email || !password || !name){
       return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
          return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
              const user = new User({
                  email,
                  password:hashedpassword,
                  name,
                  pic
              })
              user.save()
              .then(user=>{
                  res.json({message:"saved successfully"})
              })
              .catch(err=>{
                  console.log(err)
              })
        })
    })
    .catch(err=>{
      console.log(err)
    })
  })
  
router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if (!email || !password){
        return res.status(422).json({error:"please provide email and password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json("Invalid email or password")
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json("Invalid email or password")
            }
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router;