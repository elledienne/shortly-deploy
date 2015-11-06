var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index',{process:process});
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
  Link.find({},function(err,docs){
    if(err) throw(err);
    if(docs){
      res.send(200,docs);
    } 
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  console.log("THIS IS BE THE URI!!!!",uri)

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({url: uri}, function(err, link){
    if(link){
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function(err, title){
        if(err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        console.log("REQ.HEADERGBJHSCKJHKJ", req.headers.origin);
        var newLink = new Link({
          visits: 0,
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        newLink.save(function(err){
          if(err)throw err
          console.log('Link succesfully saved...')
          res.send(200, newLink);
        });
      });
    }
  });
  // new Link({ url: uri }).then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         base_url: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username:username},function(err,user) {
    if (err || !user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password,function(err,response){
        if(err) return console.log("There was error in comparing the passwords...",err) ;
        if(response){
          util.createSession(req, res, user);
        }else{
          res.redirect('/login');
        }
      })
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.find({username:username}).exec(function(err,userArray) {
    if (!userArray.length) {
      var newUser = new User({
        username: username,
        password_hash: password
      });
      newUser.save(function(err){
        if(err)throw err
        console.log('User succesfully saved...')
        util.createSession(req, res, newUser);
      })
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};


exports.navToLink = function(req, res) {
  Link.findOne({code: req.param('id')}, function(err, link){
    if(err || !link){
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function(err){
        console.log("sjhvjhsgjhhgsafsjhvajhghvj")
        if(err) throw err;
        console.log("OUR REDIRECT URL !!!!!!!!!!!!!", link.url);
        res.redirect(link.url);
        // return res.redirect(link.url)
      })
    }
  });
};

// exports.navToLink = function(req, res) {
//   new Link({ code: req.params[0] }).fetch().then(function(link) {
//     if (!link) {
//       res.redirect('/');
//     } else {
//       link.set({ visits: link.get('visits') + 1 })
//         .save()
//         .then(function() {
//           return res.redirect(link.get('url'));
//         });
//     }
//   });
//};











