// For adding Comments
$("#comment-submit").on("click", function () {
  console.log("clicked")
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  $.ajax({
    type: "POST",
    url: "/notes/save/" + thisId,
    data: {
    body: $("#comment-body")
      .val(),
    author: $("#comment-author")
      .val(),
    title: $("#comment-title")
      .val(),
  }
  }).then(function () {
    console.log("created new comment");
    // Reload the page to get the updated list
   // location.reload();
  });
});
//Handle Delete Note button
$(".deleteNote").on("click", function () {
  var noteId = $(this).attr("data-note-id");
  var articleId = $(this).attr("data-article-id");
  $.ajax({
    method: "DELETE",
    url: "/notes/delete/" + noteId + "/" + articleId
  }).done(function (data) {
    console.log(data)
    $(".modalNote").modal("hide");
    window.location = "/saved"
  })
});

$(".delete-comment").on("click", function () {
  console.log("clicked delete");
  var id = $(this).data("id");
  // Send the DELETE request.
  $.ajax("/api/comments/" + id, {
    type: "DELETE"
  }).then(function () {
    console.log("deleted comment", id);
    // Reload the page to get the updated list
  //  location.reload();
  });
});


// Saving and Unsaving
$(".save-btn").on("click", function () {
  var thisId = $(this).attr("data-id");
  console.log("save this id" +thisId);
  $.ajax({
    url: "save/" + thisId,
    type: "PUT"
  }).then(function (data) {
    console.log("updated");
    console.log(data);
  });
});
$(".un-save-btn").on("click", function () {
  var thisId = $(this).attr("data-id");
  console.log("save this id" + thisId);
  $.ajax({
    url: "unsave/" + thisId,
    type: "PUT"
  }).then(function (data) {
    console.log("updated");
    console.log(data);
  });
});