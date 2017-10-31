let discogs = "https://api.discogs.com/oauth/request_token";
let discogsBaseUrl = "https://api.discogs.com/database/search?";

function getData(searchEntry, callback) {
	$(".js-search-results").html("");
	let request = {
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
			console.log(data);
			console.log(data.results[0].resource_url);
			//console.log(data.results);
			for(let i = 0; i < data.results.length; i++) {
			let resourceUrl = data.results[i].resource_url;
			getCredits(resourceUrl)};
			displaySearchData(data);
		})
		.fail(function(data) {
			console.log(data.pagination)
	});
};


function getOutput(item) {
  let title = item.title;
  let thumb = item.thumb;

  let output = '<li class="output" id=counter><a href="#">' +
  '<div class= "list-left">' +
  '<img src=" ' + thumb + ' ">' +
  '</div class="list-right">' +
  '<h3>' + title + '</h3>' + 
  '</div>' +
  '</li>';
  return output;
}

function getCredits(discogsMasterReleaseUrl) {
	//let discogsMasterReleaseUrl = "https://api.discogs.com/masters/"
	let creditRequest = {
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
		//console.log(data)
		for (let i = 0; i < data.tracklist.length; i++) {
		console.log(data.tracklist[i].extraartists);
		let extraartists = data.tracklist[i].extraartists
		displayCredits(extraartists);
		$(".page-btn").hide();
		}
	})
	.fail(function(data) {
		return 
	})
}


function displaySearchData(data) {
	if(data.results) {
  		data.results.forEach(function(item) {
	     	let output = getOutput(item);
	     	$(".js-search-results").append(output);
    	});
	}
	else if (data.results === []){
		$(".js-search-results").append("No results matching search");
	}
}

function displayCredits(data) {
		//lightbox w/ results
		let individualCredits = data.map(function(extraArtistsData) {
			return {"name": extraArtistsData.name,
					"role": extraArtistsData.role
			}
		})
}


function submit() {
	$(".search_bar").submit(function(e) {
		e.preventDefault();
		let query = $(".search").val();
		getData(query, displaySearchData);
		$(".page-btn").show();
	});

}

$(function() {
	$(".page-btn").hide();
	submit();
});

