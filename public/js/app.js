


var displayArticles = function() {
    $.getJSON("/articles", function(data){
        for(var i = 0; i < data.length; i++) {
            $("#articles").append("<div id='artDiv'class='col-4'><img class='art-image' src='"+ data[i].image+ "'>" + "<h3>"+ data[i].title + "</h3>"+"</p><br/>" +"<a class='btn btn-secondary' href='https://www.lonelyplanet.com/travel-tips-and-articles" + data[i].link +"' role='button'>Read Article</a>  <a class='btn btn-danger' id='"+ data[i]._id+ "' href='#' role='button'>Save Article</a></div>");
        }

    });
}

// Get articles as json, display on page
$("#scrape-btn").on("click", function(){

    displayArticles();
    });
    
/* <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a>  <a class="btn btn-secondary" href="#" role="button"> Save Article</a></p> */