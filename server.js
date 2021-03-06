// Dependencies Required
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// Require all models
var db = require("./models");

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
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mongooseScraper", { useNewUrlParser: true });


// handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// get all documents from db that have saved as true
app.get('/saved/display', function (req, res) {
  
  
  db.Article.find({saved: true})
  .then(function(dbArt){
    res.json(dbArt);
  })
  .catch(function(err){
    res.json(err);
  });

 
});


// Display saved.handlebars, Connected to saved link in home nav
app.get("/saved", function(req, res){
  res.render("saved");
})

// When you go home trigger scrape and post in db
app.get("/", function (req, res) {
  res.render('home');

  axios.get("https://www.lonelyplanet.com/travel-tips-and-articles/food-and-drink" && "https://www.lonelyplanet.com/travel-tips-and-articles/art-and-culture" && "https://www.lonelyplanet.com/travel-tips-and-articles/adventure-travel")
    .then(function (response) {
      var $ = cheerio.load(response.data);

      $("article div a").each(function (i, element) {
        var result = {};

        result.title = $(this)
          .children(".card__content").children("h1")
          .text();
        result.summary = $(this)
          .children(".card__content") .children("div").children("p")
          .text(); 
        result.link = $(this)
          .attr("href");
        result.image = $(this)
          .children("figure").children("img") 
          .attr("src");

          db.Article.create(result)
          .then(function(dbArt){
            console.log(dbArt);
            
          })
          .catch(function(err){
            console.log(err);
          });
          
      });
      
    });
   
});
// find all scraped articles in db, displayed with jQuery in app.js
app.get("/articles", function(req, res){
  db.Article.find({})
  .then(function(dbArt){
    res.json(dbArt);
  })
  .catch(function(err){
    res.json(err);
  });
});


// Update saved to true on specific article id to be displayed on save page later
app.post("/articles/saved/:id", function(req, res) {
  db.Article
      .update({ _id: req.params.id }, { saved: true })
      .then(function(dbArticle) {
          res.json(dbArticle);
      })
      .catch(function(err) {
          res.json(err);
      });
});

// Update specific articles as saved: false, to remove from saved page
app.post("/articles/saved/remove/:id", function(req, res) {
  db.Article
      .update({ _id: req.params.id }, { saved: false })
      .then(function(dbArticle) {
          res.json(dbArticle);
      })
      .catch(function(err) {
          res.json(err);
      });
});
// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
     
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
//Route for deleting a note
app.delete("/articles/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id })
  .then(function(removed) {
    res.json(removed);
  }).catch(function(err,removed) {
      // If an error occurred, send it to the client
        res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {

      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
      // 
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});



// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});