
$(document).ready(function () {

  //Event listeners to dynamically render saved articles
  var articleContainer = $(".article-container");
  $(document).on("click", "btn.save", saveArticle)
  $(document).on("click", ".scrape-new", scrapeArticle);

  //Once page is ready , run the initpage function to kick things off
  initPage();

  function initPage() {
    // Run an AJAX request for any unsaved reviews
    $.get("/api/reviews?saved=false").then(function (data) {

      articleContainer.empty();
      // If we have reviews, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaining we have no articles
        renderEmpty();
      }
    });
  }

  //funtion used to scrape data (works!)
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
          .attr("href", article.reviewLink)
          .text(article.movieTitle),
        $("<a class='btn btn-success save'>Save Article From JavaScript</a>")
      )
    )
    var cardBody = $("<div class='card-body'>").text(article.review);
    card.append(cardHeader, cardBody)
    card.data("_id", article._id);
    return card;
  }



});









    // function renderEmpty() {
    //   // This function renders some HTML to the page explaining we don't have any articles to view
    //   // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    //   var emptyAlert = $(
    //     [
    //       "<div class='alert alert-warning text-center'>",
    //       "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
    //       "</div>",
    //       "<div class='card'>",
    //       "<div class='card-header text-center'>",
    //       "<h3>What Would You Like To Do?</h3>",
    //       "</div>",
    //       "<div class='card-body text-center'>",
    //       "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
    //       "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
    //       "</div>",
    //       "</div>"
    //     ].join("")
    //   );
    //   // Appending this data to the page
    //   articleContainer.append(emptyAlert);
    // }


    // function saveArticle() {
    //   // This function is triggered when the user wants to save an article
    //   // When we rendered the article initially, we attached a javascript object containing the headline id
    //   // to the element using the .data method. Here we retrieve that.
    //   var articleToSave = $(this)
    //     .parents(".card")
    //     .data();

    //   // Remove card from page
    //   $(this)
    //     .parents(".card")
    //     .remove();

    //   articleToSave.saved = true;
    //   // Using a patch method to be semantic since this is an update to an existing record in our collection
    //   console.log(articleToSave)
    //   $.ajax({
    //     method: "PUT",
    //     url: "/api/reviews/" + articleToSave._id,
    //     data: articleToSave
    //   }).then(function (data) {
    //     console.log(data)
    //     // If the data was saved successfully
    //     if (data) {
    //       // Run the initPage function again. This will reload the entire list of articles
    //       // initPage();
    //       location.reload();
    //     }
    //   });
    // }