var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,
  body: String
});

//this create out model for the above schema
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;