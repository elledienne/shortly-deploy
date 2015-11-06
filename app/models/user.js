var db = require('../config');
var bcrypt = require('bcrypt-nodejs');

var userSchema = db.Schema();

userSchema.add({
  salt:'string',
  username: 'string',
  password_hash:'string'
});

userSchema.pre('save',function(next){
  var self = this;
  bcrypt.genSalt(10, function(err, salt) {
    console.log('inside genSalt');
    if(err) throw err;
    self.salt = salt;
    bcrypt.hash(self.password_hash, salt, null,function(err, hash) {
      if(err)throw err;
      self.password_hash = hash;
      console.log(self.password_hash);
    });
  });
  next();
})

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password_hash, function(err, isMatch) {
    if(err) return callback(err);
    callback(null,isMatch);
  });
}

var User = db.model('User',userSchema);

module.exports = User;
