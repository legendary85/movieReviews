
$(document).ready(function () {

  //Event listeners to dynamically render saved articles
  $(document).on("click", ".scrape-new", scrapeArticle;
  // $(".click").on('click', function (event) {
  //   console.log("clicked")
  //   alert("💪🏾 I was clicked")
  //   scrapeArticle();
  // })



  //funtion used to scrape data
  function scrapeArticle() {
    $.get('/api/scrape').then(function (data) {
      initPage();
      console.log(data)
      window.location.href('/')
    })
  }

  function renderArticles(aticles) {
    var articleCards = []
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]))
    }
    articleContainer.append(articleCards);
  }

  function createCard(article) {
    var card = $("<div class='card'>")
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.movieLink)
          .text(article.movieTitle),
        $("<a class='btn btn-success save'>Save Article</a>")
      )
    )
    var cardBody = $("<div class='card-body'>").text(article.review);
    card.append(cardHeader, cardBody)
    card.data("_id", article._id);
    return card;
  }

  function initPage() {
    // Run an AJAX request for any unsaved headlines
    $.get("/api/headlines?saved=false").then(function (data) {

      articleContainer.empty();
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaining we have no articles
        renderEmpty();
      }
    });
  }

});