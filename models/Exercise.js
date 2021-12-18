const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const exerciseSchema = mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration:  {
    type: Number,
    required: true
  },
  date: {
      type: Date, 
      default: Date.now()
  },
})

const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = { Exercise }