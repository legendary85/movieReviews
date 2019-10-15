// Required Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models");

//Establish PORT to listen on
var PORT = 3000;

//Initialize Express
var app = express();

//Configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

//Make public a startic folder
app.use(express.static("public"));
//Connect to the Mongo DB
mongoose.connect('mongodb://localhost/movieReviews', {
  useNewUrlParser: true
});

//Routes



//Start the server
app.listen(PORT, function () {
  console.log(" 🌏 App running on port  " + PORT + "!");
});