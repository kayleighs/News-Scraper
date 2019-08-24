console.log("loaded")

// For adding Comments
$("#comment-submit").on("click", function () {
  console.log("clicked")
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  $.ajax({
    type: "POST",
    url: "/api/articles/" + thisId,
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
