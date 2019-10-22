// Required Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var controller = require("./controllers/api");
// var bodyParser = require("body-parser")

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models");

//Establish PORT to listen on
var PORT = process.env.PORT || 3000;

//Initialize Express
var app = express();

//Configure middleware
// Use body-parser for handling form submissions
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Make public a startic folder
app.use(express.static("public"));

//Controllers
controller(app);
// var router = require("./controllers/api.js");
// app.use(router);

//If deployed, use the deployed database. Otherwise us the local mongHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/movieReviews";

//Connect to the Mongo DB
// mongoose.connect(db, function(error) {
//   //Log any errors connecting with mongoose
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("mongoose connection is successful");
//   }
// });
//Connect to the MongoDB with Heroku settings
mongoose.connect(db);

// app.get("/", function (req, res) {
//   res.render("index");
// });

// //A GET route for scraping the https://www.rottentomatoes.com/critics/latest_reviews
// app.get("/scrape", function (req, res) {
//   //Grab the body of the html with axios
//   axios.get("https://www.rottentomatoes.com/critics/latest_reviews").then(function (response) {
//     // we load into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);
//     //Array to story scraped data
//     var results = [];
//     var reviewRows = $('.review_table table tbody tr');
//     reviewRows.each(function (i, element) {
//       var rating = $(element).find('td:first-child').text();
//       var movieTitle = $(element).find('td:nth-child(2)').text();
//       var movieLink = 'https://www.rottentomatoes.com' + $(element).find('td:nth-child(2) a').attr('href');
//       var summary = $(element).find('td:nth-child(3)').text();
//       var summaryText = summary.split('\n')[1];
//       var summaryDate = summary.split('\n')[3].trim();
//       var critic = $(element).find('td:nth-child(4)').text();
//       //push data to result array
//       results.push({
//         rating: rating,
//         movieTitle: movieTitle,
//         movieLink: movieLink,
//         summary: summary,
//         summaryText: summaryText,
//         summaryDate: summaryDate,
//         critic: critic
//       })

//       // var rating = $(element).find('td:first-child').text();
//       // var movieTitle = $(element).find('td:nth-child(2)').text();
//       // var movieLink = 'https://www.rottentomatoes.com' + $(element).find('td:nth-child(2) a').attr('href');
//       // var summary = $(element).find('td:nth-child(3)').text();
//       // var summaryText = summary.split('\n')[1];
//       // var summaryDate = summary.split('\n')[3].trim();
//       // var critic = $(element).find('td:nth-child(4)').text();
//       // console.log('================== MOVIE ================');
//       // console.log('rating', rating);
//       // console.log('movie title', movieTitle.trim());
//       // console.log('movie link', movieLink.trim());
//       // console.log('summary', summary.trim());
//       // console.log('summaryText', summaryText.trim());
//       // console.log('summaryDate', summaryDate.trim());
//       // console.log('critic', critic.trim());

//       // //Create a new Article using the
//       // db.Article.create(result).then(function (dbArticle) {
//       //   res.json(dbArticle);
//       // })
//       //   .then(function (err) {
//       //     console.log(err)
//       //   })
//     });
//     //Send message to client
//     // res.render("Scrape Complete")
//     console.log(results)
//   })
// })

//Start the server
app.listen(PORT, function() {
  console.log(" 🌏 App running on port  " + PORT + "!");
});
