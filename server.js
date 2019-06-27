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



app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.get('/saved', function (req, res) {
  res.render("saved");
});


// app.get("/api/saved", function(req, res) {
  

//   db.Article.find({saved: false})
//   .then(function(dbArt){
//     res.json(dbArt);
//   })
//   .catch(function(err){
//     res.json(err);
//   });
// });
// add web address to scrape

app.get("/", function (req, res) {
  res.render('home');

  axios.get("https://www.lonelyplanet.com/travel-tips-and-articles")
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

app.get("/articles", function(req, res){
  db.Article.find({})
  .then(function(dbArt){
    res.json(dbArt);
  })
  .catch(function(err){
    res.json(err);
  });
});

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
// update saved value, this will plug into 
// app.post("/", function(req,res){

// })
// app.get("/api/saved", function(req, res){
 
  
// });
// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
