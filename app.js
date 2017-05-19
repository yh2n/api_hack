var discogs = "https://api.discogs.com/oauth/request_token";
var discogsBaseUrl = "https://api.discogs.com/database/search?"

function getData(searchEntry, callback) {
	$(".js-search-results").html("");
	var request = {
		q: searchEntry,
		key: "bgZeLMbaTgrMJXHkppzG",
		secret: "KdEBhprqXmmRUCiLugLfIUBWuxYGlDHW",
		per_page: 10,
		//pageToken: token
		}

	$.ajax({
		url: discogsBaseUrl,
		type: "GET",
		dataType: "json",
		data: request,
		})
		.done(function(data) {
			// results [] = = list of results that match search criteria.
			console.log(data.results);
			displaySearchData(data);
		})
		.fail(function(data) {
			console.log(data.pagination)
	});
};

function displaySearchData(data) {
	if(data.results) {
  		data.results.forEach(function(item) {
	     	var output = getOutput(item);
	     	$(".js-search-results").append(output);
    	});
	}
}


function getOutput(item) {
  var title = item.title;
  var thumb = item.thumb;
  var 

  var output = '<li>' +
  '<div class= "list-left">' +
  '<img src=" ' + thumb + ' ">' +
  '</div class="list-right">' +
  '<h2>' + title + '</h3>' +
  '</div>' +
  '</li>';
  return output;
}

function submit() {
	$(".search_bar").submit(function(e) {
		e.preventDefault();
		var query = $(".search").val();
		getData(query, displaySearchData);
	});

}

$(function() {
	submit();
});