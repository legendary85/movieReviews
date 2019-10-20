$(document).ready(function () {

  var articleContainer = $(".article-container");

  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
    // Run an AJAX request for any unsaved headlines
    $.get("/api/headlines?saved=true").then(function (data) {

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
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>").attr("href", article.url).text(article.headline),
        $("<a class='btn btn-success save'>SAVE ARTICLE</a>")
      )
    )
    var cardBody = $("<div class='card-body'>").text(article.summary);
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

  function renderNotesList(data) {
    var noteToRender = [];
    var currentNote;

    if (!data.notes.length) {
      currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
      noteToRender.push(currentNote);
    } else {
      for (var i = 0; i < data.notes.length; i++) {
        currentNote = $("<li class='list-group-item note'>")
          .text(data.notes[i].noteText)
          .append($("<button class='btn btn-danger note-delete'>x</button>"));

        currentNote.children("button").data("_id", data.notes[i]._id);

        noteToRender.push(currentNote);
      }
    }
    // append notesToRender to the note-container inside the note modal
    $(".note-container").append(noteToRender)
  }


  function handleArticleDelete() {

    var articleToDelete = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    console.log(articleToDelete._id)
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function (data) {
      // If this works out, run initPage again which will re-render our list of saved articles
      if (data) {
        // initPage();
        window.load = "/saved"
      }
    });
  }


  function handleArticleNotes(event) {
    // This function handles opening the notes modal and displaying our notes
    // We grab the id of the article to get notes for from the card element the delete button sits inside
    var currentArticle = $(this)
      .parents(".card")
      .data();
    console.log(currentArticle)
    // Grab any notes with this headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function (data) {
      console.log(data)
      // Constructing our initial HTML to add to the notes modal
      var modalText = $("<div class='container-fluid text-center'>").append(
        $("<h4>").text("Notes For Article: " + currentArticle._id),
        $("<hr>"),
        $("<ul class='list-group note-container'>"),
        $("<textarea placeholder='New Note' rows='4' cols='60'>"),
        $("<button class='btn btn-success save'>Save Note</button>")
      );
      console.log(modalText)
      // Adding the formatted HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      console.log('noteData:' + JSON.stringify(noteData))
      // Adding some information about the article and article notes to the save button for easy access
      // When trying to add a new note
      $(".btn.save").data("article", noteData);
      // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
      renderNotesList(noteData);
    });
  } ß




  function handleNoteSave() {
    // This function handles what happens when a user tries to save a new note for an article
    // Setting a variable to hold some formatted data about our note,
    // grabbing the note typed into the input box
    var noteData;
    var newNote = $(".bootbox-body textarea")
      .val()
      .trim();
    // If we actually have data typed into the note input field, format it
    // and post it to the "/api/notes" route and send the formatted noteData as well
    if (newNote) {
      noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
      $.post("/api/notes", noteData).then(function () {
        // When complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {

    var noteToDelete = $(this).data("_id");

    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function () {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }


  function handleArticleClear() {
    $.get("api/clear")
      .then(function (data) {
        articleContainer.empty();
        // initPage();
        location.reload();
      });
  }
})