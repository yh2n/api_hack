var discogs = "https://api.discogs.com/oauth/request_token";
var discogsBaseUrl = "https://api.discogs.com/database/search?";

function getData(searchEntry, callback) {
	$(".js-search-results").html("");
	var request = {
		q: searchEntry,
		key: "bgZeLMbaTgrMJXHkppzG",
		secret: "KdEBhprqXmmRUCiLugLfIUBWuxYGlDHW",
		per_page: 10,
		type: "master"
		}

	$.ajax({
		url: discogsBaseUrl,
		type: "GET",
		dataType: "json",
		data: request,
		})
		.done(function(data) {
			// results [] = list of results that match search criteria.
			console.log(data.results[0].resource_url);
			//console.log(data);
			var resourceUrl = data.results[0].resource_url;
			getCredits(resourceUrl);
			displaySearchData(data);
		})
		.fail(function(data) {
			console.log(data.pagination)
	});
};


function getOutput(item) {
  var title = item.title;
  var thumb = item.thumb;
  var style = item.style;

  var output = '<li class="output"><a href="#">' +
  '<div class= "list-left">' +
  '<img src=" ' + thumb + ' ">' +
  '</div class="list-right">' +
  '<h3>' + title + '</h3>' +
  '</div>' +
  '</li>';
  return output;
}

function getCredits(discogsMasterReleaseUrl) {
	//var discogsMasterReleaseUrl = "https://api.discogs.com/masters/"
	var creditRequest = {
		key: "bgZeLMbaTgrMJXHkppzG",
		secret: "KdEBhprqXmmRUCiLugLfIUBWuxYGlDHW",
	}

	$.ajax({
		url: discogsMasterReleaseUrl,
		type: "GET",
		dataType: "json",
		data: creditRequest
	})
	.done(function(data) {
		console.log(data.tracklist)
	})
	.fail(function(data) {
		return //console.log(data.pagination)
	})
}


function displaySearchData(data) {
	if(data.results) {
  		data.results.forEach(function(item) {
	     	var output = getOutput(item);
	     	$(".js-search-results").append(output);
    	});
	}
	else if (data.results === []){
		$(".js-search-results").append("No results matching search");
	}
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