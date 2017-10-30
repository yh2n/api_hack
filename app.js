let discogs = "https://api.discogs.com/oauth/request_token";
let discogsBaseUrl = "https://api.discogs.com/database/search?";

function getData(searchEntry, callback) {
	$(".js-search-results").html("");
	let request = {
		q: searchEntry,
		key: "bgZeLMbaTgrMJXHkppzG",
		secret: "KdEBhprqXmmRUCiLugLfIUBWuxYGlDHW",
		per_page: 10,
		page: 1,
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
			for(let i = 0; i < data.results.length; i++) {
			let resourceUrl = data.results[i].resource_url;
			console.log(resourceUrl);
			let page = request.page;
			console.log(page);
			//getCredits(resourceUrl)
		};
			displaySearchData(data);
		})
		.fail(function(data) {
			console.log(data.pagination)
	});
};


function getOutput(item) {
  let title = item.title;
  let thumb = item.thumb;
  let style = item.style;

  let output = '<li class="output"><a href="#">' +
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
			let extraartists = data.tracklist[i].extraartists;
			for (let j = 0; j < extraartists.length; j++) {
				console.log(`${extraartists[j].name}: ${extraartists[j].role}`);
				$(".album").append(`<li>${extraartists[j].name}: ${extraartists[j].role}</li>`);
			}
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
	     	let li = $(output);
	     	displayCredits(li, item, data);
	     	$(".js-search-results").append(li);
    	});
	}
	else if (data.results === []){
		$(".js-search-results").append("No results matching search");
	}
	$(".page-btn").show();
	//navigate(request);
}	

function displayCredits(li, item, data) {
	li.on("click", function(e) {
		console.log(item);
		$(".lightbox").css("display", "block");
		e.preventDefault();
		let resourceUrl = item.resource_url;
		console.log(resourceUrl);
		getCredits(resourceUrl);
		$(".album").append(`<li class="title">Album: ${item.title}</li>`);
		$(".additional_info").append(
			`<li class="single-results">Genre: <span>${item.genre}</span></li>` +
			`<li class="single-results">Label: <span>${item.label}</span></li>` +
			`<li class="single-results">Format: <span>${item.format}</span></li>` +
			`<li class="single-results">Country: <span>${item.country}</span></li>` +
			`<li class="single-results">Year: <span>${item.year}</span></li>` 
			);
		displaySearchData(data);
	});
}

function navigate(info, getData) {
	let page = info.page;
	let state = {page : 1}
	let count = state.page;
	$(".page-btn").on("click", function(e) {
		console.log(e);
		count++;
		console.log(count);
	})
}

function submit() {
	$(".search_bar").submit(function(e) {
		e.preventDefault();
		let query = $(".search").val();
		getData(query, displaySearchData);
	});

}

$(function() {
	$(".page-btn").hide();
	submit();
});

