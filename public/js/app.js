// Grab the Articles as json
$.getJSON("/articles", function (data) {
  //for each one
  for (var i = 0; i < data.length; i++) {
    //Dispay the information on the page

  }
})


app.get("/reviews", function (req, res) {
  db.Article.find({}).then(function (dbArticle) {
    res.render("index", {
      style: "home.css"
    })
  })
})