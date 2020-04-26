import {spinnerLarge} from "./mtdMustaches.js";
import {make} from "./utils.js";

const giphyKey = "Vb45700bexRDqCkbMdUmBwDvtkWT9Vj2"; // swiper no swipey
let lastGiphyURL = "";
let isLoadingMoreGifs = false;

export function initGifPanel() {
	$(".drawer .js-add-image-button").after(
		make("button")
		.addClass("js-show-tip btn btn-on-blue full-width txt-left padding-v--6 padding-h--12 margin-b--12 mtd-gif-button")
		.append(
			make("i").addClass("Icon icon-gif txt-size--18"),
			make("span").addClass("label padding-ls").html("Add GIF")
		)
		.attr("data-original-title","")
		.click(() => {

			if ($(".mtd-gif-button").hasClass("is-disabled")) {
				return;
			}

			if (exists(window.mtdEmojiPicker)) {
				try {
					window.mtdEmojiPicker.hidePicker();
				} catch(e) {
					console.error("failed to hide emoji picker");
					console.error(e);
					lastError = e;
				}
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
	);
}

/*
	Creates the GIF panel, also handles scroll events to load more GIFs
*/

function createGifPanel() {
	if ($(".mtd-gif-container").length > 0) {
		return;
	}
	$(".drawer .compose-text-container").after(
		make("div").addClass("scroll-v popover mtd-gif-container").append(
			make("div").addClass("mtd-gif-header").append(
				//make("h1").addClass("mtd-gif-header-text").html("Trending"),
				make("input").addClass("mtd-gif-search").attr("placeholder","Search GIFs...").change(() => {
					searchGifPanel($(".mtd-gif-search").val())
				}),
				make("img").attr("src",mtdBaseURL + "sources/img/giphy.png").addClass("mtd-giphy-logo"),
				make("button").addClass("mtd-gif-top-button").append(
					make("i").addClass("icon icon-arrow-u"),
					"Go back up"
				).click(() => {
					$(".drawer .compose>.compose-content>.antiscroll-inner.scroll-v.scroll-styled-v").animate({ scrollTop: "0px" });
				}),
				make("div").addClass("mtd-gif-no-results list-placeholder hidden").html("We couldn't find anything matching what you searched. Give it another shot.")
			),
			make("div").addClass("mtd-gif-column mtd-gif-column-1"),
			make("div").addClass("mtd-gif-column mtd-gif-column-2")
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

/*
	Renders a specific GIF, handles click function
*/

function renderGif(preview, mainOg) {
	let main = mainOg;

	return make("img").attr("src", preview).click(function() {
		let img;

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

			let buildEvent = jQuery.Event("dragenter",eventThing);
			let buildEvent2 = jQuery.Event("drop",eventThing);

			console.info("alright so these are the events we're gonna be triggering:");
			console.info(buildEvent);
			console.info(buildEvent2);

			$(".mtd-gif-container").removeClass("mtd-gif-container-open").delay(300).remove();;
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
		col1.children().remove();
		col2.children().remove();

		$(".mtd-gif-no-results").removeClass("hidden");

		if (data === "error") {
			$(".mtd-gif-no-results").html("An error occurred while trying to fetch results. " + (error || ""))
		} else {
			$(".mtd-gif-no-results").html("We couldn't find anything matching what you searched. Give it another shot.")
		}
	}

	for (let i = 0; i < data.length; i++) {
		if (i % 2 === 0) {
			col1.append(
				renderGif(data[i].images.preview_gif.url,data[i].images.original.url)
			)
		} else {
			col2.append(
				renderGif(data[i].images.preview_gif.url,data[i].images.original.url)
			)
		}
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

/*
	Main thread for a gif panel search
*/

function searchGifPanel(query) {
	$(".mtd-gif-column-1").children().remove();
	$(".mtd-gif-column-2").children().remove();

	$(".mtd-gif-no-results").addClass("hidden");

	isLoadingMoreGifs = true;

	let sanitiseQuery = query.replace(/\s/g,"+").replace(/\&/g,"&amp;").replace(/\?/g,"").replace(/\//g," OR ")
	lastGiphyURL = "https://api.giphy.com/v1/gifs/search?q="+sanitiseQuery+"&api_key="+giphyKey+"&limit=20";

	$.ajax(
		{
			url:lastGiphyURL
		}
	).done((e) => {
		renderGifResults(e.data);
	})
	.error((e) => {
		console.error("Error trying to fetch gifs");
		console.error(e);
		lastError = e;
		renderGifResults("error",e);
	})
	.always(() => {
		isLoadingMoreGifs = false;
	});
}

/*
	GIF panel when you first open it up, showing trending GIFs
*/

function trendingGifPanel() {
	$(".mtd-gif-column-1").children().remove();
	$(".mtd-gif-column-2").children().remove();

	$(".mtd-gif-no-results").addClass("hidden");

	isLoadingMoreGifs = true;

	lastGiphyURL = "https://api.giphy.com/v1/gifs/trending?api_key="+giphyKey+"&limit=20";

	$.ajax(
		{
			url:lastGiphyURL
		}
	).done((e) => {
		renderGifResults(e.data);
	})
	.error((e) => {
		console.log(e);
		console.error("Error trying to fetch gifs");
		lastError = e;
		renderGifResults("error",e);
	})
	.always(() => {
		isLoadingMoreGifs = false;
	});
}

/*
	Let's load some more gifs from Giphy, triggered by scrolling
*/

function loadMoreGifs() {
	isLoadingMoreGifs = true;
	$.ajax(
		{
			url:lastGiphyURL + "&offset=" + $(".mtd-gif-container img").length
		}
	).done((e) => {
		renderGifResults(e.data);
	})
	.error((e) => {
		console.log(e);
		console.error("Error trying to fetch gifs");
		lastError = e;
		renderGifResults("error",e);
	})
	.always(() => {
		isLoadingMoreGifs = false;
	});
}

/*
	Disables adding GIFs if there's already an image (or GIF) attached to a Tweet.

	You can only send 1 GIF per tweet after all.
*/

export function checkGifEligibility() {
	let disabledText = "";

	// has added images
	if ($(".compose-media-grid-remove,.compose-media-bar-remove").length > 0) {
		disabledText = "You cannot upload a GIF with other images";
	}
	// has quoted tweet
	if ($(".compose-content .quoted-tweet").length > 0) {
		disabledText = "Quoted Tweets cannot contain GIFs";
	}

	if (disabledText !== "") {
		$(".mtd-gif-button").addClass("is-disabled").attr("data-original-title",disabledText);
		$(".mtd-gif-container").remove();
	} else {
		$(".mtd-gif-button").removeClass("is-disabled").attr("data-original-title","");
	}
}
