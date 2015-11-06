var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');

// var User = db.model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//     });
//   }
// });
console.log(db)


var userSchema = db.Schema();

userSchema.add({
  salt:'string',
  username: 'string',
  password_hash:'string'
});



userSchema.pre('save',function(next){
  var self = this;
  bcrypt.genSalt(10, function(err, salt) {
    if(err) throw err;
    self.salt = salt;
    bcrypt.hash(self.password_hash, salt, null,function(err, hash) {
      if(err)throw err;
      self.password_hash = hash;
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
