var db = require("../models");
module.exports = function (app) {
  app.get("/", function (req, res) {
    db.Article.find({}).then(function (result) {
      res.render("index", {
        Articles: result
      });
    });
  });
};