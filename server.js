// Dependencies Required
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// Require all models
var db = require("./models/Notes");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongooseScraper", { useNewUrlParser: true });



app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// add web address to scrape

app.get("/scrape", function (req, res) {

  axios.get("https://www.lonelyplanet.com/travel-tips-and-articles")
    .then(function (response) {
      var $ = cheerio.load(response.data);

      $("article div a").each(function (i, element) {
        var result = {};

        result.title = $(this)
          .children(".card__content").children("h1")
          .text();
        result.link = $(this)
          .attr("href");
        result.image = $(this)
          .children("figure").children("img") 
          .attr("src");

          console.log(result);
      })
    })
})


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
