let discogs = "https://api.discogs.com/oauth/request_token";
let discogsBaseUrl = "https://api.discogs.com/database/search?";

//initial call to API
//passes the input value(query), displaySearchData and navigate functions
//called within navigate and submit functions
function getData(searchEntry, callback, pageNumber) {
	console.log("pageNumber", pageNumber);
	$(".js-search-results").html("");
	let request = {
		q: searchEntry,
		key: "bgZeLMbaTgrMJXHkppzG",
		secret: "KdEBhprqXmmRUCiLugLfIUBWuxYGlDHW",
		per_page: 15,
		page: pageNumber,
		type: "master"
		}
	console.log(request.per_page);
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
			//getCredits(resourceUrl)
		};
			displaySearchData(data);
		})
		.fail(function(data) {
			console.log(data.pagination)
	});
};

//	creates <li> template to be appended to ".search-results" class in
// displaySearchData
function getOutput(item) {
  let title = item.title;
  let thumb = item.thumb;
  let style = item.style;

  let output = '<li class="output"><a href="#">' +
  '<div>' +
  '<img src=" ' + thumb + ' ">' +
  '</div>' +
  '<h3>' + title + '</h3>' + 
  '</div>' + '</a>' +
  '</li>';
  return output;
}

//makes a second request to api and gets the "extrartist" object
//called within displayCredits
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
				$(".individual_credits").append(
					`<ul>` + 
						`<li>${extraartists[j].role}: </li>` +
					`</ul>` +
					`<ul>` +
						`<li class="recording-info">${extraartists[j].name}</li>` + 
					`</ul>`
				);
			}
		}
	})
	.fail(function(data) {
		return 
	})
}


//appends and displays results of initial call to ".js-search-results" <ul>
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
	$(".next").show();
}	

//creates <li> template to be appended to ".additional_info" class in displayCredits function
function getAdditionalInfo(item)  {
	let additionalInfo = 
		`<ul>` +
			`<li class="single-results">Genre: </li>` +
			`<li class="single-results">Label: </li>` + 
			`<li class="single-results">Format: </li>` + 
			`<li class="single-results">Country: </li>` + 
			`<li class="single-results">Year: </li>` + 
		`</ul>` +
		`<ul>` +
			`<li class="recording-info">${item.genre}</li>` +
			`<li class="recording-info">${item.label}</li>` +
			`<li class="recording-info">${item.format}</li>` +
			`<li class="recording-info">${item.country}</li>` +
			`<li class="recording-info">${item.year}</li>` +
		`<ul>`;
	return additionalInfo
}

function getThumb(item) {
	let thumb = `<img class="lightbox_thumb" src=${item.thumb}></img>`
	return thumb
}

//displays individual credits additional info in lightbox
//calls getCredits
function displayCredits(li, item, data) {
	let additionalInfo = getAdditionalInfo(item);
	let thumb = getThumb(item);
	li.find("a").on("click", function(e) {
		console.log(item);
		$(".search_bar").hide();
		$(".lightbox").css("display", "block");
		e.preventDefault();
		let resourceUrl = item.resource_url;
		console.log(resourceUrl);
		getCredits(resourceUrl);
		$(".individual_credits").append(`<li class="title">Album: ${item.title}</li>`);
		$(".additional_info").append(additionalInfo);
		$(".thumb").append(thumb);
	});
	$("span").on("click", function(e) {
		$(".search_bar").show();
		$(".lightbox").css("display", "none");
		$(".additional_info").empty();
		$(".individual_credits").empty();
		$(".thumb").empty();
	});
	$(window).on("click", function(e) {
		if(e.currentTarget == $(".lightbox")) {
		$(".lightbox").css("display", "none");	
		$(".search_bar").show();
		}
	});
}

// event listener attached to ".next" and ".prev" buttons
// calls getData with pageNumber as parameter 
pageNumber = 1;
$(".next").on("click", function(e) {
	console.log(e);
	console.log(pageNumber);
	let query = $(".search").val();
	query = sessionStorage.getItem("search");
	console.log(query, "query");
	pageNumber++;
//makes another api request w/ pageNumber as argument
	getData(query, displaySearchData, pageNumber);
     $(".js-search-results").empty();
	if (pageNumber > 1) {
		$(".prev").show();
	};
	console.log(pageNumber);
});
$(".prev").on("click", function(e) {
	let query = $(".search").val();
	query = sessionStorage.getItem("search");
	pageNumber--;
	getData(query, displaySearchData, pageNumber);
	console.log(pageNumber);
	if (pageNumber < 2) {
		$(".prev").hide();
	};
})


//submits client's query with pageNumber paramater set to 1
function submit() {
	$(".search_bar").submit(function(e) {
		e.preventDefault();
		let query = $(".search").val();
		sessionStorage.setItem("search", query);
		getData(query, displaySearchData, 1);
		$(".search").val("");
	});

}

//document ready
$(function() {
	$(".page-btn").hide();
	submit();
});

