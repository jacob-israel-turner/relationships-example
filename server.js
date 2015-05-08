/*
 * eBay
 *
 * Jim
 *  - iPods
 *  - iPhones
 *  - USB Cables
 *
 * Joe
 *  - Kitchen-Aid
 *  - Spatulas
 *
 * Susan
 *  - Cars
 *  - Homes
 *
 */

// One-To-One
// Facebook - User to Address
// Username
// Emails
// Password
//
// One-To-Many
// Amazon - Shopping Cart
// Audible - One Author, many publications
// Yelp - One user, many reviews
// Yelp - One company, many reviews
// Instagram, Twitter - One user, many posts
// Craigslist - One user, many listings
// 
// Many-To-Many
// Google Plus Groups - Many users, many groups
// Meetup - Many users, many groups
// OpenSource/Github - Many contributors, many projects
// 

var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
var mongoUri = 'localhost/relationships';
var port = 9001;

app.use(cors());
app.use(bodyParser.json());


app.post('/api/users', function(req, res){
  User.create(req.body, function(err, response){
    if(err) return res.status(500).json(err);
    else return res.json(response);
  })
});

app.get('/api/users', function(req, res){
  User
    .find()
    .populate('cart')
    .exec(function(err, response){
      if(err) return res.status(500).json(err);
      else return res.json(response);
    });
})

app.post('/api/cart', function(req, res){
  User.findOne({ _id: req.query.id }, function(err, response){
    if(err) return res.status(500).json(err);
    else {
      response.cart.push(req.body._id);
      response.save(function(err, response){
        if(err) return res.status(500).json(err);
        else return res.json(response);
      });
    }
  });
});

app.post('/api/products', function(req, res){
  Product.create(req.body, function(err, response){
    if(err) return res.status(500).json(err);
    else return res.json(response);
  })
});

app.get('/api/products', function(req, res){
  Product.find({}, function(err, response){
    if(err) return res.status(500).json(err);
    else return res.json(response);
  });
})

app.put('/api/products', function(req, res){
  var id = req.body._id;
  delete req.body._id;
  Product.update({ _id: id}, req.body, function(err, response){
    if(err) return res.status(500).json(err);
    else return res.json(response);
  })
});


mongoose.connect(mongoUri, function(err){
  if(err) return console.log(err);
  app.listen(port, function(){
    console.log('Now listening on port: ', port);         
  })
})


var userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  address: {
    line_one: String,
    line_two: String,
    city: String,
    state: String
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

var User = mongoose.model('User', userSchema);

var productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String
});

var Product = mongoose.model('Product', productSchema);

