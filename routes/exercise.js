const express = require('express')
const router = express.Router()
const moment = require('moment');
const { Exercise } = require('../models/Exercise')
const { User } = require('../models/User')

router.post('/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body
  const { _id } = req.params
  console.log(_id)
  try {
    const user = await User.findById(_id)
    if (!user) throw new Error('Unknown userId')

    // let newDate = new Date(date).toDateString()
    // if (newDate == 'Invalid Date') throw new Error(`Cast to date failed for value "${date}" at path "date"`)
    const newExercise = new Exercise({
      user: _id,
      description,
      duration,
      date
    })
    const saved = await newExercise.save()
    res.json({
      _id: user._id,
      username: user.username,
      description: saved.description,
      duration: saved.duration,
      date: new Date(saved.date).toDateString()
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})


router.get('/users/:_id/logs', async (req, res, next) => {
  let { from, to, limit } = req.query;
  const { _id } = req.params
  try {

    from = moment(from, 'YYYY-MM-DD').isValid() ? moment(from, 'YYYY-MM-DD') : 0;
    to = moment(to, 'YYYY-MM-DD').isValid() ? moment(to, 'YYYY-MM-DD') : moment().add(1000000000000);

    const foundUser = await User.findById(_id)
    if (!foundUser) throw new Error('Unknown user with _id');

    const exercise = await Exercise.find({ user: _id }).where('date').gte(from).lte(to).limit(!limit || limit==0 ? 999 : parseInt(limit)).exec()

    res.json({
      _id: _id,
      username: foundUser.username,
      count: exercise.length,
      log: exercise.map(o => ({
        description: o.description,
        duration: o.duration,
        date: new Date(o.date).toDateString()
      }))
    })

  }
  catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
})

module.exports = router