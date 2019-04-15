var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  bday: { type: String, required: true },
  username: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, lowercase: true, required: true, unique: true },
  profession: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  watchlist: {type: Array}
});

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, null, null, function (err, hash) {
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  })
})

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User', UserSchema);
