$(document).ready(function () {

  var articleContainer = $(".article-containner")
  $(document).on("click", ".scrape-new", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $("clear").on('click', handleArticleClear)


  // AJAX function that will call the api route to scrape source
  function handleArticleScrape() {
    $.get('/api/scrape').then(function (data) {
      // initPage();
      console.log(data)
      // window.location.href('/')
      location.reload();
    })
  }

  function renderArticles(aticles) {
    var articleCards = []
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));

    }
    articleContainer.append(articleCards);
  }


  function createCard(article) {
    var card = $("<div class='card'>");
    var carHeader = $("<div class='card-header'>").append(
      $('<h3>').append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>").attr("href", article.reviewLink).text(article.movieTitle),
        $("<a class='btn btn-success save'>SAVE ARTICLE</a>")
      )
    )
    var cardBody = $("<div class='card-body'>").text(article.review);
    card.apped(carHeader, cardBody)
    card.data("_id", article._id);
    return card;
  }

  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>No New Articles Yet!</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    )
    appendContainer.append(emptyAlert)
  }

  function handleArticleSave() {
    var articleToSave = $(this).parents(".card").data();
    //remove card from page
    $(this).parents(".card").remove();

    articleToSave.saved = true;
    console.log(articleToSave);

    $.ajax({
      method: "PUT",
      url: "/api/reviews/" + articleToSave._id,
      data: articleToSave
    }).then(function (data) {
      console.log(data)
      if (data) {
        location.reload();
      }
    });
  }

  function handleArticleClear() {
    $.get("/api/clear").then(function (data) {
      console.log(data)
      articleContainer.empty()
      location.reload();
    })
  }


})