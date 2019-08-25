var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request = require('request');
// Requiring Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

// Routes
module.exports = function (app) {
// A GET route for scraping the echoJS website
app.get("/scrape2", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://news.artnet.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article.teaser").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children().children().children("h2.teaser-title")
        .text();
      result.link = $(this)
        .children().children("a")
        .attr("href");
      result.summary = $(this)
        .children().children().children("p.teaser-blurb")
        .text();
      result.image = $(this)
        .children("a").children("div.image-wrapper").children("img").attr("src");
      result.saved = false;
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
  axios.get()
});
//Scrape for no duplicates
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://news.artnet.com/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      var linksArray = [];
      // Now, we grab every h2 within an article tag, and do the following:
      $("article.teaser").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children().children().children("h2.teaser-title")
          .text();
        result.link = $(this)
          .children().children("a")
          .attr("href");
        result.summary = $(this)
          .children().children().children("p.teaser-blurb")
          .text();
        result.image = $(this)
          .children("a").children("div.image-wrapper").children("img").attr("src");
        result.saved = false;
        // Create a new Article using the `result` object built from scraping
        if (linksArray.indexOf(result.link) == -1) {

          // push the saved title to the array 
          linksArray.push(result.link);
          console.log(linksArray)
          // only add the article if is not already there
          Article.countDocuments({ link: result.link }, function (err, test) {
            //if the test is 0, the entry is unique and good to save
            if (test == 0) {

              db.Article.create(result)
                .then(function (dbArticle) {
                  // View the added result in the console
                  console.log(dbArticle);
                })
                .catch(function (err) {
                  // If an error occurred, log it
                  console.log(err);
                });
            }
          });
        }
        else {
          console.log('Article already exists.')
        }
      });
      // Send a message to the client
      res.send("Scrape Complete");
    });
    axios.get()
  });





// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find().sort({ _id: -1 })
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note, only for API
app.get("/api/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("notes")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
//to load each individual page, Old, doesn't get the link body
  app.get("/articlesOld/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("notes")
      .then(function (dbArticle) {
        console.log(dbArticle)
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.render("article",{
          Article: dbArticle,
      })
/*       .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      }); */
  });
  });

//for Scraping full article
  app.get('/articles/:id', function (req, res) {
    var articleId = req.params.id;
    //console.log(articleId)
    var hbsObj = {
      Article: [],
      body: []
    };
    // //find the article at the id
    db.Article.findOne({ _id: articleId })
      .populate("notes")
      .exec(function (err, doc) {
        if (err) {
          console.log('Error: ' + err);
        } else {
          hbsObj.Article = doc;
          var link = doc.link;
          console.log(link)
          //grab article from link
          request(link, function (error, response, html) {
            var $ = cheerio.load(html);
            $('.article-body').each(function (i, element) {
              hbsObj.body = $(this).children('p').text();
              //console.log(hbsObj)
              //send article body and comments to article.handlbars through hbObj
              res.render('article', hbsObj);
              //prevents loop through so it doesn't return an empty hbsObj.body
              return false;
            });
          });
        }
      });
  });



  //not needed
  app.post("/api/comments", function (req, res) {
    db.Comment.create(req.body).then(function (dbComments) {
      //     res.redirect("/api/comments");
      res.json(dbComments);
    });
  });


  // Route for saving/updating an Article's associated Note, old code, not needed
  app.post("/api/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    console.log(req.body)
    db.Note.create(req.body)
      .then(function (dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });



  // Create a new note
  app.post("/notes/save/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    var newNote = new Note({
      body: req.body.body,
      title: req.body.title,
      author: req.body.author,
      article: req.params.id
    });
    console.log(req.body)
    // And save the new note the db
    newNote.save(function (error, note) {
      if (error) {
        console.log(error);
      }
      else {
        // Use the article id to find and update it's notes
        Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": note } })
          // Execute the above query
          .exec(function (err) {
            if (err) {
              console.log(err);
              res.send(err);
            }
            else {
              // Or send the note to the browser
              res.send(note);
            }
          });
      }
    });
  });

  // Delete a note
  app.delete("/notes/delete/:note_id/:article_id", function (req, res) {
    // Use the note id to find and delete it
    Note.findOneAndRemove({ "_id": req.params.note_id }, function (err) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "notes": req.params.note_id } })
          // Execute the above query
          .exec(function (err) {
            if (err) {
              console.log(err);
              res.send(err);
            }
            else {
              // Or send the note to the browser
              res.send("Note Deleted");
            }
          });
      }
    });
  });
// Saving and Unsaving
  app.put("/save/:id", function (req, res) {
    db.Article.updateOne({ _id: req.params.id }, { $set: { saved: true } })
      .then(function (dbArticleSave) {
        res.json(dbArticleSave);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
  app.put("/unsave/:id", function (req, res) {
    db.Article.updateOne({ _id: req.params.id }, { $set: { saved: false } })
      .then(function (dbArticleSave) {
        res.json(dbArticleSave);
      })
      .catch(function (err) {
        res.json(err);
      });
  });


};