const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// now we are creating schema for the author
const authorSchema = new Schema({
  // the schema on RHS is nothing but the schema that we have got in line 2
  //now authorSchema will have following things
  name: String,
  age: Number
});

// now we have defined the authorSchema, we need to export the model
module.exports = mongoose.model("Author", authorSchema);
// "Author" is the name of the model, which is based on "authorSchema"
