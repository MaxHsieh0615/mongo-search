var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new noteSchema object
// This is similar to a Sequelize model
var noteSchema = new Schema({
  // `title` is of type String
  _storyId: {
    type: Schema.Types.ObjectId,
    ref: "Story"
  },
  date: String,
  noteText: String
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", noteSchema);

// Export the Note model
module.exports = Note;
