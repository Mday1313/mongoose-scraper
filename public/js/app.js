


var displayArticles = function () {
    $.getJSON("/articles", function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#articles").append("<div id='artDiv'class='col-4'><img class='art-image' src='" + data[i].image + "'>" + "<h3>" + data[i].title + "</h3>" + "</p><br/><p class='summary'>" + data[i].summary + "</p>" + "<a class='btn btn-secondary' href='https://www.lonelyplanet.com/travel-tips-and-articles" + data[i].link + "' role='button'>Read Article</a>  <a class='btn btn-danger save-btn' id='" + data[i]._id + "'method='POST' onclick='AddButtonClick()' role='button'>Save Article</a></div>");
        }

    });
}


var displaySaved = function () {
    console.log("im here")
    $("#saved-well").empty();
    $.getJSON("/saved/display", function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#saved-well").append("<div id='saveDiv'class='col-12'><div class='row'><img class='save-image col-3' src='" + data[i].image + "'>" + "<div class='col-9'><h3>" + data[i].title + "</h3>" + "</p><br/><p class='summary'>" + data[i].summary + "</p>" + "<a class='btn btn-secondary' href='https://www.lonelyplanet.com/travel-tips-and-articles" + data[i].link + "' role='button'>Read Article</a>  <a class='btn btn-warning remove-save-btn' id='" + data[i]._id + "'  role='button'>Remove from Saved</a>  <a class='btn btn-info note-btn' data-id='" + data[i]._id + "' href='/' role='button'>Add a Note</a></div></div></div>");
        }

    });
}
// Get articles as json, display on page
$("#scrape-btn").on("click", function () {

    displayArticles();
});

$("#save-display").on("click", function () {

console.log("click")
    displaySaved();
});
$(document).on("click", ".remove-save-btn", function () {

    console.log("Remove click");
    var thisId = $(this).attr("id");
    console.log(thisId);
    $.ajax({
        method: "POST",
        url: "/articles/saved/remove/" + thisId,
        success: function (response) {
            console.log("Success remove!!!");

            displaySaved();
        },
        error: function (error) {
            console.log(error);
        }
        
    });
    
});
$(document).on("click", ".save-btn", function () {

    console.log("click");
    var thisId = $(this).attr("id");
    console.log(thisId);
    $.ajax({
        method: "POST",
        url: "/articles/saved/" + thisId,
        success: function (response) {
            console.log("Success!!!");
        },
        error: function (error) {
            console.log(error);
        }
    });
});

function AddButtonClick(){ 
    //change text from add to Update
    $(".save-btn").text('Saved');
  }