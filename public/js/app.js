// Get articles as json, display on page
$("#scrape-btn").on("click", function(){

displayArticles();
})

var displayArticles = function() {
    $.getJSON("/articles", function(data){
        for(var i = 0; i < data.length; i++) {
            $("#articles").append("<div id='artDiv'class='col-4'><img class='art-image' src='"+ data[i].image+ "'>" + "<h2>"+ data[i].title + "</h2>"+"</p><br/>" +"<a class='btn btn-secondary' href='https://www.lonelyplanet.com/travel-tips-and-articles" + data[i].link +"' role='button'>Read Article</a>  <a class='btn btn-danger' href='#' role='button'>Save Article</a></div>");
        }
    });
}
{/* <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a>  <a class="btn btn-secondary" href="#" role="button"> Save Article</a></p> */}