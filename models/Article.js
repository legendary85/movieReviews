var mongoose = require("mongoose");

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  rating: {
    type: String,
    required: false
  },
  movieTitle: {
    type: String,
    required: true
  },
  //link is required and of type string
  reviewLink: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },

  // critic: {
  //   type: String,
  //   required: true
  // },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
