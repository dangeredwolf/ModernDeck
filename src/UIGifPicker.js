/*
	UIGifPicker.js

	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT License
*/

import {spinnerLarge} from "./DataMustaches.js";
import {make} from "./Utils.js";
import { I18n } from "./I18n.js";

const giphyKey = "Vb45700bexRDqCkbMdUmBwDvtkWT9Vj2";
const tenorKey = "OPS2J07J0KWA";

let lastTenorPos = "";
let lastGfycatPos = "";

let lastGiphyURL = "";
let lastGfycatURL = "";
let lastTenorURL = "";

let giphyData = {};
let gfycatData = {};
let tenorData = {};

let lastQuery = "";
let isLoadingMoreGifs = false;

let isWaitingOnGiphy = false;
let isWaitingOnGfycat = false;
let isWaitingOnTenor = false;

let dataGiphy = null;
let dataGfycat = null;
let dataTenor = null;

// let isHoveringOver = false;
let hoverTimeout = null;

export function initGifPanel() {
	$(".mtd-gif-button").off("click").click(() => {

		checkGifEligibility();

		if ($(".mtd-gif-button").hasClass("is-disabled")) {
			return;
		}

		if ($(".mtd-gif-container").length <= 0) {
			createGifPanel();
		}

		$(".mtd-gif-container").toggleClass("mtd-gif-container-open");
		if ($(".mtd-gif-container").hasClass("mtd-gif-container-open")) {
			$(".mtd-gif-search").val("");
			trendingGifPanel();
		} else {
			$(".mtd-gif-container").remove();
		}
	})
}

/*
	Creates the GIF panel, also handles scroll events to load more GIFs
*/

function createGifPanel() {

	if ($(".mtd-gif-container").length > 0) {
		return;
	}

	checkGifEligibility();
	$(".drawer .compose-text-container").after(
		make("div").addClass("scroll-v popover mtd-gif-container").append(
			make("div").addClass("mtd-gif-header").append(
				//make("h1").addClass("mtd-gif-header-text").html(I18n("Trending")),
				make("input").addClass("mtd-gif-search").attr("placeholder",I18n("Search GIFs...")).change(() => {
					searchGifPanel($(".mtd-gif-search").val())
				}),
				make("button").addClass("mtd-gif-info-button").append(make("i").addClass("icon icon-info")).mouseover(() => {
					hoverTimeout = setTimeout(() => {
						$(".mtd-gif-info").removeClass("hidden")
					}, 500)
				}).mouseout(() => {
					$(".mtd-gif-info").addClass("hidden");
					if (hoverTimeout) {
						clearTimeout(hoverTimeout);
						hoverTimeout = undefined;
					}
				}),
				make("button").addClass("mtd-gif-top-button").append(
					make("i").addClass("icon icon-arrow-u")
				).click(() => {
					$(".drawer .compose>.compose-content>.antiscroll-inner.scroll-v.scroll-styled-v").animate({ scrollTop: "0px" });
				}),
				make("div").addClass("mtd-gif-no-results list-placeholder hidden").html(I18n("We couldn't find anything matching what you searched. Give it another shot."))
			),
			make("div").addClass("mtd-gif-column mtd-gif-column-1"),
			make("div").addClass("mtd-gif-column mtd-gif-column-2"),
			make("div").addClass("mtd-gif-info dropdown-menu hidden").append(
				make("p").html(I18n("ModernDeck GIF Search uses the following sources:")),
				make("img").attr("src",mtdBaseURL + "resources/img/giphy.png").addClass("mtd-giphy-logo"),
				make("img").attr("src",mtdBaseURL + "resources/img/tenor.svg").addClass("mtd-giphy-logo"),
				make("img").attr("src",mtdBaseURL + "resources/img/gfycat.svg").addClass("mtd-giphy-logo")
			)
		)
	)

	$(".drawer .compose>.compose-content>.antiscroll-inner.scroll-v.scroll-styled-v").scroll(function() { // no fancy arrow functions, we're using $(this)
		if ($(this).scrollTop() > $(document).height() - 200) {
			$(".mtd-gif-header").addClass("mtd-gif-header-fixed popover")
		} else {
			$(".mtd-gif-header").removeClass("mtd-gif-header-fixed popover")
		}
		if (isLoadingMoreGifs) {
			return;
		}
		if ($(this).scrollTop() + $(this).height() > $(this).prop("scrollHeight") - 200) {
			isLoadingMoreGifs = true;
			loadMoreGifs();
		}
	})
}

function combinedLength(arr1, arr2, arr3) {
	let len = 0;
	if (arr1) {
		len += arr1.length;
	}
	if (arr2) {
		len += arr2.length;
	}
	if (arr3) {
		len += arr3.length;
	}
	return len;
}

function combineArrays(arr1, arr2, arr3) {
	let newArr = [];
	if (arr1)
		arr1.reverse()
	if (arr2)
		arr2.reverse()
	if (arr3)
		arr3.reverse()

	while (combinedLength(arr1, arr2, arr3) > 0) {
		if (arr1 && arr1.length > 0) {
			newArr.push(arr1.pop());
		}
		if (arr2 && arr2.length > 0) {
			newArr.push(arr2.pop());
		}
		if (arr3 && arr3.length > 0) {
			newArr.push(arr3.pop());
		}
	}

	return newArr;

}

// https://staxmanade.com/2017/02/how-to-download-and-convert-an-image-to-base64-data-url/

async function getBlobFromUrl(imageUrl) {
	let res = await fetch(imageUrl);
	let blob = await res.blob();

	return new Promise((resolve, reject) => {
		resolve(blob);
		return blob;
	})
}

/*
	Renders a specific GIF, handles click function
*/

function renderGif(preview, mainOg, provider, audio) {
	let main = mainOg;


	return make("img").attr("src", preview).attr("data-provider", provider).click(function() {
		let img;

		$(".mtd-gif-container").removeClass("mtd-gif-container-open");

		getBlobFromUrl(main).then((img) => {

			let eventThing = {
				originalEvent:{
					dataTransfer:{
						files:[
							img
						]
					}
				}
			};

			let buildEvent = jQuery.Event("dragenter", eventThing);
			let buildEvent2 = jQuery.Event("drop", eventThing);

			console.info("alright so these are the events we're gonna be triggering:");
			console.info(buildEvent);
			console.info(buildEvent2);

			$(".mtd-gif-container").removeClass("mtd-gif-container-open").delay(300).remove();
			$(document).trigger(buildEvent);
			$(document).trigger(buildEvent2);

		})
	});
}

/*
	Renders GIF results page
*/

function renderGifResults(data, error) {
	$(".mtd-gif-container .preloader-wrapper").remove();

	let col1 = $(".mtd-gif-column-1");
	let col2 = $(".mtd-gif-column-2");

	$(".mtd-gif-no-results").addClass("hidden");

	if (data.length === 0 || data === "error") {
		col1.empty();
		col2.empty();

		$(".mtd-gif-no-results").removeClass("hidden");

		if (data === "error") {
			$(".mtd-gif-no-results").html(I18n("An error occurred while trying to fetch results.") + (error || ""))
		} else {
			$(".mtd-gif-no-results").html(I18n("We couldn't find anything matching what you searched. Give it another shot."))
		}
	}

	for (let i = 0; i < data.length; i++) {
		let obj = data[i];
		let provider = "unknown";

		let previewURL = "";
		let originalURL = "";

		if (obj.gfyId) {
			provider = "gfycat";
			previewURL = obj.max1mbGif || obj.max2mbGif || obj.max5mbGif || obj.gif100px;
			originalURL = obj.gifUrl
		} else if (obj.media) {
			provider = "tenor";
			previewURL = obj.media[0].nanogif.url;
			originalURL = obj.media[0].gif.url;
		} else if (obj.images) {
			provider = "giphy";
			previewURL = obj.images.preview_gif.url;
			originalURL = obj.images.original.url;
		}

		obj.provider = provider;

		console.log(obj);

		let renderedGif = renderGif(previewURL, originalURL, provider, obj.hasAudio || obj.hasaudio);

		if (i % 2 === 0) {
			col1.append(renderedGif);
		} else {
			col2.append(renderedGif);
		}

		renderedGif.attr("muted","muted")
	}
}

/*
	Simple function that appends a loading spinner to the gif container
*/

function gifPanelSpinner() {
	$(".mtd-gif-container").append(
		spinnerLarge
	)
}

function checkIfAllDataIsThere() {
	if (isWaitingOnGiphy || isWaitingOnTenor || isWaitingOnGfycat) {
		return;
	}
	isLoadingMoreGifs = false;
	console.log("GIF LOADING COMPLETE.");
	aggregateData = combineArrays(giphyData.data, tenorData.results, gfycatData.gfycats)
	lastTenorPos = tenorData.next;
	lastGfycatPos = gfycatData.cursor;

	renderGifResults(aggregateData)
}

function fetchGiphy() {
	isWaitingOnGiphy = true;

	$.ajax(
		{
			url:lastGiphyURL
		}
	).done((e) => {
		giphyData = e;
		console.log(e);
	})
	.error((e) => {
		console.error("Error trying to fetch Giphy GIFs");
		console.error(e);
		lastError = e;
	})
	.always(() => {
		isWaitingOnGiphy = false;
		checkIfAllDataIsThere();
	});
}

function fetchGfycat() {
	isWaitingOnGfycat = true;

	$.ajax(
		{
			url:lastGfycatURL
		}
	).done((e) => {
		gfycatData = e;
		console.log(e);
	})
	.error((e) => {
		console.error("Error trying to fetch Gfycat GIFs");
		console.error(e);
		lastError = e;
	})
	.always(() => {
		isWaitingOnGfycat = false;
		checkIfAllDataIsThere();
	});
}

function fetchTenor() {
	isWaitingOnTenor = true;

	$.ajax(
		{
			url:lastTenorURL
		}
	).done((e) => {
		tenorData = e;
		console.log(e);
	})
	.error((e) => {
		console.error("Error trying to fetch Tenor GIFs");
		console.error(e);
		lastError = e;
	})
	.always(() => {
		isWaitingOnTenor = false;
		checkIfAllDataIsThere();
	});
}

/*
	Main thread for a gif panel search
*/

function searchGifPanel(query) {
	$(".mtd-gif-column-1").empty();
	$(".mtd-gif-column-2").empty();

	$(".mtd-gif-no-results").addClass("hidden");

	isLoadingMoreGifs = true;

	let sanitiseQuery = query.replace(/\s/g,"+").replace(/\&/g,"&amp;").replace(/\?/g,"").replace(/\//g," OR ");
	lastQuery = sanitiseQuery;

	fetchAllSearch(query);
}

function fetchAllTrending() {
	if ($("[data-provider=tenor]").length <= 0) {
		lastTenorPos = "";
	}
	if ($("[data-provider=gfycat]").length <= 0) {
		lastGfycatPos = "";
	}

	lastGiphyURL = "https://api.giphy.com/v1/gifs/trending?api_key="+giphyKey+"&limit=20&offset="+$("[data-provider=giphy]").length;
	lastTenorURL = "https://api.tenor.com/v1/trending?key="+tenorKey+"&locale="+window.I18n.getFullLanguage()+"&limit=20&pos="+lastTenorPos;
	lastGfycatURL = "https://api.gfycat.com/v1/gfycats/trending?count=20&lang="+window.I18n.getMainLanguage()+"&cursor="+lastGfycatPos;

	console.log(lastGiphyURL);
	console.log(lastTenorURL);
	console.log(lastGfycatURL);

	fetchGiphy();
	fetchGfycat();
	fetchTenor();
}

function fetchAllSearch(query) {
	if ($("[data-provider=tenor]").length <= 0) {
		lastTenorPos = "";
	}
	if ($("[data-provider=gfycat]").length <= 0) {
		lastGfycatPos = "";
	}

	lastGiphyURL = "https://api.giphy.com/v1/gifs/search?q="+query+"&api_key="+giphyKey+"&limit=20&offset="+$("[data-provider=giphy]").length;
	lastTenorURL = "https://api.tenor.com/v1/search?q="+query+"&key="+tenorKey+"&limit=20&locale="+window.I18n.getFullLanguage()+"&pos="+lastTenorPos;
	lastGfycatURL = "https://api.gfycat.com/v1/gfycats/search?search_text="+query+"&count=20&lang="+window.I18n.getMainLanguage()+"&cursor="+lastGfycatPos;

	console.log(lastGiphyURL);
	console.log(lastTenorURL);
	console.log(lastGfycatURL);

	fetchGiphy();
	fetchGfycat();
	fetchTenor();
}

/*
	GIF panel when you first open it up, showing trending GIFs
*/

function trendingGifPanel() {
	$(".mtd-gif-column-1").empty();
	$(".mtd-gif-column-2").empty();

	$(".mtd-gif-no-results").addClass("hidden");

	isLoadingMoreGifs = true;

	lastQuery = null;

	fetchAllTrending();
}

/*
	Let's load some more gifs from Giphy, triggered by scrolling
*/

function loadMoreGifs() {
	if (lastQuery) {
		fetchAllSearch(lastQuery)
	} else {
		fetchAllTrending()
	}
}

/*
	Disables adding GIFs if there's already an image (or GIF) attached to a Tweet.

	You can only send 1 GIF per tweet after all.
*/

export function checkGifEligibility() {
	let disabledText = "";

	// has added images
	if ($(".compose-media-grid-remove,.compose-media-bar-remove").length > 0) {
		disabledText = I18n("You cannot upload a GIF with other images");
	}
	// has quoted tweet
	if ($(".compose-content .quoted-tweet").length > 0) {
		disabledText = I18n("Quoted Tweets cannot contain GIFs");
	}

	if (disabledText !== "") {
		$(".mtd-gif-button").addClass("is-disabled").attr("data-original-title",disabledText);
		$(".mtd-gif-container").remove();
	} else {
		$(".mtd-gif-button").removeClass("is-disabled").attr("data-original-title","");
	}
}
