var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
module.exports = function (app) {
  
  app.get("/", function (req, res) {
    db.Article.find().sort({ _id: -1 }).then(function (result) {
      res.render("index", {
        Articles: result
      });
    });
  });
  app.get("/saved", function (req, res) {
    db.Article.find({ saved: true}).then(function (result) {
      res.render("saved", {
        Articles: result
      });
    });
  });

/*   app.get("/articles/:id", function (req, res) {
    db.Articles.find({ where: { id: req.params.id } }).then(
      function (dbArticles) {
        db.Comment.findAll({ where: { source: req.params.id } }).then(
          function (dbComments) {
            res.render("article", {
              Articles: dbArticles,
              Comments: dbComments
            });
          }
        );
      }
    );
  }); */
};