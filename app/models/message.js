var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/

// set up a mongoose model
var MessageSchema = new Schema({
  dest: {
        type: String,
        required: true
    },
  exp: {
        type: String,
        required: true
    },
  message: {
        type: String,
        required: true
    }
});
var Message = mongoose.model('Message', MessageSchema);
module.exports = Message
