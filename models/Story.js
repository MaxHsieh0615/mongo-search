var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var StorySchema = new Schema({
  // `title` is required and of type String
  // unique means we prevent the app to scrape the same article over and over again
  headline: {
    type: String,
    required: true,
    unique: true
  },
  // `link` is required and of type String
  summary: {
    type: String,
    required: true
  },
  date: String,
  // saved default to false, but if the user decides to save the ariticle, then we set it to true
  saved: {
    type: Boolean,
    default: false
  }
});

// This creates our model from the above schema, using mongoose's model method
var Story = mongoose.model("Story", StorySchema);

// Export the Story model
module.exports = Story;


  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Story with an associated Note