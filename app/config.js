var path = require('path');
var mongoose = require('mongoose');

if(process.env.NODE_ENV !== 'production'){
  mongoose.connect('mongodb://localhost:27017/test');
} else {
  mongoose.connect(MONGO_CREDENTIALS);
}

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.connection.once('open', function (cb) {
  console.log("Connection to mongodb established...");
});

module.exports = mongoose;
