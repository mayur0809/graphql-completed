const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// now we are creating schema for the book
const bookSchema = new Schema({
  // the schema on RHS is nothing but the schema that we have got in line 2
  //now bookSchema will have following things
  name: String,
  genre: String,
  authorId: String
});

// now we have defined the bookschema, we need to export the model
module.exports = mongoose.model("Book", bookSchema);
// "Book" is the name of the model, which is based on "bookSchema"
