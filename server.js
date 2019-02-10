var express = require("express");
var exhbrs = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// Port
var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Set up an Express Router
var router = express.Router();

// Require my routes file pass our router object
require("./config/routes")(router);

// Make public a static folder
app.use(express.static(__dirname + "/public"));

// Connect Handlebars to my Express app
app.engine("handlebars", exhbrs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Parse request body as JSON
app.use(bodyParser.urlencoded({ extended: false }));

// Have every requrest go through our router middleware
app.use(router);

// Connect to the Mongo DB
var db = process.env.MONGODB_UBI || "mongodb://localhost/hwsearchdb"
mongoose.connect(db, function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("mongoose connection is successful");
  }
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

