let discogs = "https://api.discogs.com/oauth/request_token";
let discogsBaseUrl = "https://api.discogs.com/database/search?";
let totalPages;

//INITIAL CALL TO API
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
    };
    $.ajax({
        url: discogsBaseUrl,
        type: "GET",
        dataType: "json",
        data: request
    })
        .done(function(data) {
            // results [] = list of results that match search criteria.
            console.log(data.pagination);
            if (data.pagination.items === 0) {
                $(".js-search-results").append(
                    `<p class="result_message">No results matching your search 		 critreria<br/>	
				Check the spelling and try again<p/>`
                );
            }
            totalPages = data.pagination.pages;
            for (let i = 0; i < data.results.length; i++) {
                let resourceUrl = data.results[i].resource_url;
                console.log(resourceUrl);
            }
            displaySearchData(data);
        })
        .fail(function(data) {
            console.log(data.pagination);
        });
}

//SUBMITS USER'S QUERY WITH "pageNumber" SET TO 1
function submit() {
    $(".search_bar").submit(function(e) {
        e.preventDefault();
        let query = $(".search").val();
        let progress = `${totalPages}`;
        sessionStorage.setItem("search", query);
        $("fieldset").addClass("hidden");
        $(".reset").removeClass("hidden");
        getData(query, displaySearchData, pageNumber);
        $(".search_query")
            .append(query)
            .addClass("displayed");
        $(".search").val("");
    });
}

//APPENDS AND DISPLAYS RESULTS OF INITIAL CALL TO ".js-search-results" <ul>
function displaySearchData(data) {
    if (data.results) {
        $(".pagination")
            .html(`${pageNumber}/${totalPages}`)
            .addClass("displayed");
        data.results.forEach(function(item) {
            let output = getOutput(item);
            let li = $(output);
            displayCredits(li, item, data);
            $(".js-search-results").append(li);
            if (pageNumber < totalPages) {
                $(".next").show();
            } else {
                $(".next").hide();
            }
            console.log(pageNumber, totalPages);
        });
    } else if (data.results === []) {
        $(".js-search-results").append("No results matching search");
    }
}

//CREATES <li> TEMPLATE TO BE APPENDED TO ".js-search-results" class in displaySearchData
function getOutput(item) {
    let title = item.title;
    let thumb = item.thumb;

    let output =
        '<li class="output"><a href="#">' +
        '<div class="thumb_container">' +
        '<img src=" ' +
        thumb +
        ' ">' +
        "</div>" +
        "<h3>" +
        title +
        "</h3>" +
        "</div>" +
        "</a>" +
        "</li>";
    return output;
}

// EVENT LISTENER ATTACHED TO ".next" and ".prev" BUTTONS
// CALLS "getData"
let pageNumber = 1;

$(".next").on("click", function(e) {
    let query = $(" .search").val();
    query = sessionStorage.getItem("search");
    console.log(query, ": query");
    pageNumber++;
    getData(query, displaySearchData, pageNumber);
    $(".js-search-results").empty();
    if (pageNumber > 1) {
        $(".prev").show();
    } else if ((pageNumber = totalPages)) {
        $(".next").hide();
    }
    console.log(pageNumber, totalPages);
});

$(".prev").on("click", function(e) {
    let query = $(".search").val();
    query = sessionStorage.getItem("search");
    pageNumber--;
    getData(query, displaySearchData, pageNumber);
    console.log(pageNumber);
    if (pageNumber < 2) {
        $(".prev").hide();
    }
});

//MAKES A SECOND REQUEST TO API AND GETS  "extraartist" OBJECT
//INVOKED WITHIN displayCredits
function getCredits(discogsMasterReleaseUrl) {
    //let discogsMasterReleaseUrl = "https://api.discogs.com/masters/"
    let creditRequest = {
        key: "bgZeLMbaTgrMJXHkppzG",
        secret: "KdEBhprqXmmRUCiLugLfIUBWuxYGlDHW"
    };

    $.ajax({
        url: discogsMasterReleaseUrl,
        type: "GET",
        dataType: "json",
        data: creditRequest
    })
        .done(function(data) {
            console.log(data.tracklist);
            console.log(data.tracklist[1].title);
            for (let i = 0; i < data.tracklist.length; i++) {
                $(".individual_credits").append(
                    `<li class="track">${data.tracklist[i].title}</li>`
                );
                if (data.tracklist[i].extraartists) {
                    console.log(data.tracklist[i].extraartists);
                    let extraartists = data.tracklist[i].extraartists;
                    for (let j = 0; j < extraartists.length; j++) {
                        console.log(
                            `${extraartists[j].role}: ${extraartists[j].name}`
                        );
                        $(".individual_credits").append(
                            `<ul>` +
                                `<li>${extraartists[j].role}: ${
                                    extraartists[j].name
                                }</li>` +
                                `</ul>`
                        );
                    }
                }
            }
        })
        .fail(function(data) {
            console.log(data);
        });
}

//DISPLAYS INDIVIDUAL CREDITS AND ADDITIONAL INFO IN LIGHTBOX
//CALLS getCredits
function displayCredits(li, item, data) {
    let additionalInfo = getAdditionalInfo(item);
    let thumb = getThumb(item);
    li.find("a").on("click", function(e) {
        console.log(item);
        $(".lightbox").css("display", "block");
        e.preventDefault();
        let resourceUrl = item.resource_url;
        console.log(resourceUrl);
        getCredits(resourceUrl);
        $(".additional_info").append(additionalInfo);
        $(".thumb").append(thumb, item.title);
    });
    $(".lightbox").on("click", function(e) {
        $(".lightbox").css("display", "none");
        $(".additional_info").empty();
        $(".individual_credits").empty();
        $(".thumb").empty();
    });
}

//CREATES <li> TEMPLATE TO BE APPENDED TO ".additional_info" CLASS displayCredits FUNCTION
function getAdditionalInfo(item) {
    let additionalInfo =
        `<li class="single-results">Genre: ${item.genre}</li>` +
        `<li class="single-results">Label: ${item.label}</li>` +
        `<li class="single-results">Format: ${item.format}</li>` +
        `<li class="single-results">Country: ${item.country}</li>` +
        `<li class="single-results">Year: ${item.year}</li>`;
    return additionalInfo;
}

function getThumb(item) {
    let thumb = `<div class="lightbox_thumb_container"><img class="lightbox_thumb" src=${
        item.thumb
    }></img>`;
    return thumb;
}

$(".reset").on("click", function() {
    window.location.reload();
});

$(function() {
    $(".page-btn").hide();
    submit();
});
