const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
 
})

userSchema.plugin(passportLocalMongoose); // build automatic password hashing and salting and username
    module.exports = mongoose.model('User', userSchema);