var express = require("express");
var router = express.Router();
var exphbs = require("express-handlebars");
var db = require('../models');
var axios = require("axios");
var cheerio = require("cheerio");
// var bodyParser = require("body-parser");

//Routes

module.exports = function (app) {


  // Main route renders homepage
  // app.get("/", function (req, res) {
  //   db.Article.find({ saved: false }, function (err, data) {
  //     res.render("home", { home: true, style: "home.css", article: data });

  //   })
  // });
  app.get("/", function (req, res) {
    db.Article.find({}, function (err, data) {
      res.render("home", { style: "home.css", article: data });

    })
  });


  // app.get("/reviews", function (req, res) {
  //   db.Article.find({}).then(function (dbArticle) {
  //     res.render("index", {
  //       style: "home.css"
  //     })
  //   })
  // })


  //A GET route for scraping the https://www.rottentomatoes.com/critics/latest_reviews
  app.get("/api/scrape", function (req, res) {
    //Grab the body of the html with axios
    axios.get("https://www.rottentomatoes.com/critics/latest_reviews").then(function (response) {
      // we load into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      //Array to story scraped data
      var reviewRows = $('.review_table table tbody tr');
      reviewRows.each(function (i, element) {
        var result = {};

        //add the text and href of every link and save them as properties of the result object

        // result.rating = $(this).children('td:first-child').text().replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        result.movieTitle = $(this).children('td:nth-child(2)').text().replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        result.review = $(this).children('td:nth-child(3)').text().replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        result.reviewLink = $(element).find('td:nth-child(3) a').attr('href');


        // var rating = $(element).find('td:first-child').text();
        // var movieTitle = $(element).find('td:nth-child(2)').text();
        // var movieLink = 'https://www.rottentomatoes.com' + $(element).find('td:nth-child(2) a').attr('href');
        // var summary = $(element).find('td:nth-child(3)').text();
        // // var summaryText = summary.split('\n')[1];
        // // var summaryDate = summary.split('\n')[3];
        // var critic = $(element).find('td:nth-child(4)').text();
        //push data to result array
        // results.push({
        //   rating: rating.replace("\n", '').trim(),
        //   movieTitle: movieTitle.replace("\n", '').trim(),
        //   movieLink: movieLink.replace("\n", '').trim(),
        //   summary: summary.replace("\n", '').trim(),
        //   // summaryText: summaryText.replace("\n", '').trim(),
        //   // summaryDate: summaryDate.replace("\n", '').trim(),
        //   critic: critic.replace("\n", '').trim()
        // })

        // var rating = $(element).find('td:first-child').text();
        // var movieTitle = $(element).find('td:nth-child(2)').text();
        // var movieLink = 'https://www.rottentomatoes.com' + $(element).find('td:nth-child(2) a').attr('href');
        // var summary = $(element).find('td:nth-child(3)').text();
        // var summaryText = summary.split('\n')[1];
        // var summaryDate = summary.split('\n')[3].trim();
        // var critic = $(element).find('td:nth-child(4)').text();
        console.log('================== MOVIE ================');
        // console.log('rating', result.rating);
        console.log('movie title', result.movieTitle.trim());
        console.log('review', result.review.trim());
        console.log('review link', result.reviewLink);
        // console.log('summaryText', summaryText.trim());
        // console.log('summaryDate', summaryDate.trim());
        // console.log('critic', critic.trim());

        if (result.movieTitle !== '' && result.reviewLink !== '') {
          db.Article.findOne({ movieTitle: result.movieTitle }, function (err, data) {
            if (err) {
              console.log(err)
            } else {
              if (data === null) {
                console.log("Data is null and not entered")
                db.Article.create(result)
                  .then(function (dbArticle) {
                    console.log("Data Entered")
                    res.json(results);
                    // console.log(dbArticle)
                  })
                  .catch(function (err) {

                    // If an error occurred, send it to the client
                    console.log(err)
                  });
              }
              // console.log("article data" + " " + data)
            }
          });
        }

      });
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape completed!");
    });
  })

  app.get("/api/reviews", function (req, res) {
    //to find all reviews
    db.Article.find({}).then(function (dbArticle) {
      res.json(dbArticle)
    }).catch(function (err) {
      res.json(err)
    })

  })

  //This route renders the saved handlebars page
  app.get("/saved", function (req, res) {
    db.Article.find({ saved: false }, function (err, data) {
      res.render("saved", { home: false, article: data });
    })
  })

  //save article to database  changed fied = true
  app.put("/api/reviews/:id", function (req, res) {
    var saved = req.body.saved == 'true'
    if (saved) {
      db.Article.updateOne({ _id: req.body._id }, { $set: { saved: true } }, function (err, result) {
        if (err) {
          console.log(err)
        } else {
          return res.send(true)
        }
      })
    }
  })

  //delete Article form DB
  app.delete("/api/reviews/:id", function (req, res) {
    console.log('reqbody:' + JSON.stringify(req.params.id))
    db.Article.deleteOne({ _id: req.params.id }, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        return res.send(true)
      }
    });
  })


  //notes
  app.post('/articles/id/:id', function (req, res) {
    db.Note
  })

}
