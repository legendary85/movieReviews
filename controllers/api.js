var express = require("express");
var router = express.Router();
var exphbs = require("express-handlebars");
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
// var bodyParser = require("body-parser");

//Routes

module.exports = function(app) {
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //The only routes where hadlebars will render data
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //Home Page
  app.get("/", function(req, res) {
    db.Article.find({ saved: false }, function(err, data) {
      res.render("home", { home: true, article: data });
    });
  });

  // saved pages
  app.get("/saved", function(req, res) {
    db.Article.find({ saved: true }, function(err, data) {
      res.render("saved", { home: false, article: data });
    });
  });

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //All api routes below
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //update article in db by the changed saved field to true

  app.put("/api/headlines/:id", function(req, res) {
    var saved = req.body.saved == "true";
    if (saved) {
      db.Article.updateOne(
        { _id: req.body._id },
        { $set: { saved: true } },
        function(err, result) {
          if (err) {
            console.log(err);
          } else {
            return res.send(true);
          }
        }
      );
    }
  });

  //delete article form database
  app.delete("/api/headlines/:id", function(req, res) {
    db.Article.deleteOne({ _id: req.params.id }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        return res.send(true);
      }
    });
  });

  //A GET route for scraping the https://www.rottentomatoes.com/critics/latest_reviews
  app.get("/api/scrape", function(req, res) {
    //Grab the body of the html with axios
    axios
      .get("https://www.rottentomatoes.com/critics/latest_reviews")
      .then(function(response) {
        // we load into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        //Array to story scraped data
        var reviewRows = $(".review_table table tbody tr");
        reviewRows.each(function(i, element) {
          var result = {};

          //add the text and href of every link and save them as properties of the result object

          // result.rating = $(this).children('td:first-child').text().replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
          result.headline = $(this)
            .children("td:nth-child(2)")
            .text()
            .replace(/(\r\n|\n|\r|\t|\s+)/gm, " ")
            .trim();
          result.summary = $(this)
            .children("td:nth-child(3)")
            .text()
            .replace(/(\r\n|\n|\r|\t|\s+)/gm, " ")
            .trim();
          result.url = $(element)
            .find("td:nth-child(3) a")
            .attr("href");

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
          // console.log('================== MOVIE ================');
          // // console.log('rating', result.rating);
          // console.log('movie title', result.movieTitle.trim());
          // console.log('review', result.review.trim());
          // console.log('review link', result.reviewLink);
          // console.log('summaryText', summaryText.trim());
          // console.log('summaryDate', summaryDate.trim());
          // console.log('critic', critic.trim());

          if (result.headline !== "" && result.url !== "") {
            db.Article.findOne({ headline: result.headline }, function(
              err,
              data
            ) {
              if (err) {
                console.log(err);
              } else {
                if (data === null) {
                  console.log("Data is null and not entered");
                  db.Article.create(result)
                    .then(function(dbArticle) {
                      console.log("Data Entered" + result);
                      // res.json(result);
                      console.log(dbArticle);
                    })
                    .catch(function(err) {
                      // If an error occurred, send it to the client
                      console.log(err);
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
  });

  //>>>>>>>>>>>>>NOTES>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // get back all notes for a given article
  app.get("/api/notes/:id", function(req, res) {
    // res.send(true)
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        console.log(dbArticle.note);
        res.json(dbArticle.note);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  //add note to a article
  app.post("/api/notes", function(req, res) {
    console.log(req.body);
    db.Note.create({ noteText: req.body.noteText }).then(function(dbNote) {
      console.log("bdNote:" + dbNote);
      return db.Article.findOneAndUpdate(
        { _id: req.body._headlineId },
        { $push: { note: dbNote._id } },
        { new: true }
      );
    });
  });

  // delete note form article
  app.delete("/api/notes/:id", function(req, res) {
    console.log("reqbody:" + JSON.stringify(req.params.id));
    db.Note.deleteOne({ _id: req.params.id }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        return res.send(true);
      }
    });
  });

  // clear all articles from database
  app.get("/api/clear", function(req, res) {
    console.log(req.body);
    db.Article.deleteMany({}, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(true);
      }
    });
  });
};
