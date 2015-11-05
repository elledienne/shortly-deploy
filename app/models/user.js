var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

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
  id:'number',
  password_hash:'string'
});

var User = db.model('User',userSchema);


userSchema.pre('save',function(next){
  var self = this;
  bcrypt.genSalt(10, function(err, salt) {
    if(err) throw err;
    self.salt = salt;
    bcrypt.hash(self.password, salt, null,function(err, hash) {
      if(err)throw err;
      self.password_hash = hash;
    });
  });
  next();
})

userSchema.static.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
}




module.exports = User;
