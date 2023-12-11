const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});


const connectionSchema = new mongoose.Schema({
  friend_id: {
    type: mongoose.ObjectId,
    required: true
  },
  platforms: [platformSchema],
  connected_date: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  profile_picture: {
    type: String,
    default: ''
  },
  platforms: [platformSchema],
  connections: [connectionSchema]
});

const Platform = mongoose.model('Platform', platformSchema)
const Connection = mongoose.model('Connection', connectionSchema)
const User = mongoose.model('User', userSchema)

exports.Platform = Platform
exports.Connection = Connection
exports.User = User
