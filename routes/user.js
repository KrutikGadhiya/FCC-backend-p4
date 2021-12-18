const express = require('express')
const router = express.Router()
const { User } = require('../models/User')

router.post('/users', async (req, res) => {
  const { username } = req.body
  // console.log(req.body)
  try{
    const newUser = new User({
      username
    })
    const saved = await newUser.save()
    res.json({username: saved.username, _id: saved._id})
  }
  catch (err) {
    console.log(err)
    // console.log(err.errors.name.properties.message)
    res.status(500).send(err.message)
    // res.json(err.errors.name.properties.message)
  }
})

router.get('/users', async (req,res) => {
  try{
    const users = await User.find()
    res.json(users)
  }
  catch (err){
    console.log(err)
    res.status(500).send(err.message)
  }
})

module.exports = router