var db = require("../models");
module.exports = function (app) {
  app.get("/", function (req, res) {
    db.Article.find({}).then(function (result) {
      res.render("index", {
        Articles: result
      });
    });
  });
/*   app.get("/articles/:id", function (req, res) {
    db.Articles.find({ where: { id: req.params.id } }).then(
      function (dbArticles) {
        db.Comment.findAll({ where: { source: req.params.fullName } }).then(
          function (dbComments) {
            res.render("candidate", {
              Articles: dbArticles,
              Comments: dbComments
            });
          }
        );
      }
    );
  }); */
};