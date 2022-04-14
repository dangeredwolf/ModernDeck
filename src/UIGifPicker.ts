/*
	UIGifPicker.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils";
import { I18n } from "./I18n";

const giphyKey: string = "Vb45700bexRDqCkbMdUmBwDvtkWT9Vj2";
const tenorKey: string = "OPS2J07J0KWA";

let lastTenorPos: string = "";
let lastGfycatPos: string = "";

let lastGiphyURL: string = "";
let lastGfycatURL: string = "";
let lastTenorURL: string = "";

let giphyData: GiphyData = { data: null };
let gfycatData: GfycatData = { gfycats: null, cursor: null };
let tenorData: TenorData = { results: null, next: null };

let lastQuery: string = "";
let isLoadingMoreGifs: boolean = false;

let isWaitingOnGiphy: boolean = false;
let isWaitingOnGfycat: boolean = false;
let isWaitingOnTenor: boolean = false;

// let isHoveringOver = false;
let hoverTimeout: number | NodeJS.Timeout = null;

enum GifProvider {
	GIPHY,
	GFYCAT,
	TENOR,
	UNKNOWN
}

interface GiphyData {
	data: Gif[];
}

interface TenorData {
	next: string;
	results: Gif[];
}

interface GfycatData {
	cursor: string;
	gfycats: Gif[];
}

type GifTenor = {
	nanogif: {
		url: string
	};
	gif: {
		url: string
	};
}

type GifGiphy = {
	preview_gif: {
		url: string;
	};
	original: {
		url: string;
	};
}

interface Gif {
	gifUrl: string;
	// gfycat
	gfyId?: string;
	max1mbGif?: string;
	max2mbGif?: string;
	max5mbGif?: string;
	gif100px?: string;

	// Tenor
	media?: GifTenor[];

	// Giphy
	images?: GifGiphy;

	provider: GifProvider;

	hasAudio?: boolean;
	hasaudio?: boolean;
}


export const initGifPanel = (): void => {
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

const createGifPanel = (): void => {

	if ($(".mtd-gif-container").length > 0) {
		return;
	}

	checkGifEligibility();
	$(".drawer .compose-text-container").after(
		make("div").addClass("scroll-v popover mtd-gif-container").append(
			make("div").addClass("mtd-gif-header").append(
				//make("h1").addClass("mtd-gif-header-text").html(I18n("Trending")),
				make("input").addClass("mtd-gif-search").attr("placeholder",I18n("Search GIFs...")).change(() => {
					searchGifPanel(String($(".mtd-gif-search").val()))
				}),
				make("button").addClass("mtd-gif-info-button").append(make("i").addClass("icon icon-info")).mouseover(() => {
					hoverTimeout = setTimeout(() => {
						$(".mtd-gif-info").removeClass("hidden")
					}, 500)
				}).mouseout(() => {
					$(".mtd-gif-info").addClass("hidden");
					if (hoverTimeout) {
						clearTimeout(Number(hoverTimeout));
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
				make("img").attr("src",`${window.mtdBaseURL}/assets/img/giphy.png`).addClass("mtd-giphy-logo"),
				make("img").attr("src",`${window.mtdBaseURL}/assets/img/tenor.svg`).addClass("mtd-giphy-logo"),
				make("img").attr("src",`${window.mtdBaseURL}/assets/img/gfycat.svg`).addClass("mtd-giphy-logo")
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

const combinedLength = (arr1: Gif[], arr2: Gif[], arr3: Gif[]) => {
	let len: number = 0;
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

const combineArrays = (arr1?: Gif[], arr2?: Gif[], arr3?: Gif[]) => {
	let newArr: Gif[] = [];
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

const getBlobFromUrl = async (imageUrl: string): Promise<Blob> => {
	let res = await fetch(imageUrl);
	let blob = await res.blob();

	return new Promise((resolve) => {
		resolve(blob);
		return blob;
	})
}

/*
	Renders a specific GIF, handles click function
*/

const renderGif = (preview: string, mainOg: string, provider: GifProvider): JQuery<HTMLElement> => {
	let main = mainOg;

	return make("img").attr("src", preview).attr("data-provider", provider).click((): void => {
		$(".mtd-gif-container").removeClass("mtd-gif-container-open");

		getBlobFromUrl(main).then((img): void => {

			let eventThing = {
				originalEvent:{
					dataTransfer:{
						files:[
							img
						]
					}
				}
			};

			let buildEvent: JQuery.Event = jQuery.Event("dragenter", eventThing);
			let buildEvent2: JQuery.Event = jQuery.Event("drop", eventThing);

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

const renderGifResults = (data: Gif[], error?: string): void => {
	$(".mtd-gif-container .preloader-wrapper").remove();

	let col1 = $(".mtd-gif-column-1");
	let col2 = $(".mtd-gif-column-2");

	$(".mtd-gif-no-results").addClass("hidden");

	if (data.length === 0 || typeof error !== "undefined") {
		col1.empty();
		col2.empty();

		$(".mtd-gif-no-results").removeClass("hidden");

		if (typeof error !== "undefined") {
			$(".mtd-gif-no-results").html(I18n("An error occurred while trying to fetch results.") + (error || ""))
		} else {
			$(".mtd-gif-no-results").html(I18n("We couldn't find anything matching what you searched. Give it another shot."))
		}
	}

	for (let i = 0; i < data.length; i++) {
		let obj: Gif = data[i];
		let provider: GifProvider = GifProvider.UNKNOWN;

		let previewURL: string = "";
		let originalURL: string = "";

		if (obj.gfyId) {
			provider = GifProvider.GFYCAT;
			previewURL = obj.max1mbGif || obj.max2mbGif || obj.max5mbGif || obj.gif100px;
			originalURL = obj.gifUrl
		} else if (obj.media) {
			provider = GifProvider.TENOR;
			previewURL = obj.media[0].nanogif.url;
			originalURL = obj.media[0].gif.url;
		} else if (obj.images) {
			provider = GifProvider.GIPHY;
			previewURL = obj.images.preview_gif.url;
			originalURL = obj.images.original.url;
		}

		obj.provider = provider;

		console.log(obj);

		let renderedGif = renderGif(previewURL, originalURL, provider);

		if (i % 2 === 0) {
			col1.append(renderedGif);
		} else {
			col2.append(renderedGif);
		}

		renderedGif.attr("muted","muted")
	}
}

const checkIfAllDataIsThere = (): void => {
	if (isWaitingOnGiphy || isWaitingOnTenor || isWaitingOnGfycat) {
		return;
	}
	isLoadingMoreGifs = false;
	console.log("GIF LOADING COMPLETE.");
	const aggregateData = combineArrays(giphyData.data, tenorData.results, gfycatData.gfycats)
	lastTenorPos = tenorData.next;
	lastGfycatPos = gfycatData.cursor;

	renderGifResults(aggregateData)
}

const fetchGiphy = (): void => {
	isWaitingOnGiphy = true;

	$.ajax(
		{
			url:lastGiphyURL
		}
	).done((results: GiphyData): void => {
		giphyData = results;
	})
	// @ts-ignore - jQuery types appear to be missing error function in Ajax even tho it's real and on jQuery docs
	.error((err: Error): void => {
		console.error("Error trying to fetch Giphy GIFs");
		console.error(err);
		window.lastError = err;
	})
	.always((): void => {
		isWaitingOnGiphy = false;
		checkIfAllDataIsThere();
	});
}

const fetchGfycat = (): void => {
	isWaitingOnGfycat = true;

	$.ajax(
		{
			url:lastGfycatURL
		}
	).done((results: GfycatData) => {
		gfycatData = results;
	})
	// @ts-ignore - jQuery types appear to be missing error function in Ajax even tho it's real and on jQuery docs
	.error((e: Error) => {
		console.error("Error trying to fetch Gfycat GIFs");
		console.error(e);
		window.lastError = e;
	})
	.always(() => {
		isWaitingOnGfycat = false;
		checkIfAllDataIsThere();
	});
}

const fetchTenor = (): void => {
	isWaitingOnTenor = true;

	$.ajax(
		{
			url:lastTenorURL
		}
	).done((results: TenorData) => {
		tenorData = results;
	})
	// @ts-ignore - jQuery types appear to be missing error function in Ajax even tho it's real and on jQuery docs
	.error((e: Error) => {
		console.error("Error trying to fetch Tenor GIFs");
		console.error(e);
		window.lastError = e;
	})
	.always(() => {
		isWaitingOnTenor = false;
		checkIfAllDataIsThere();
	});
}

/*
	Main thread for a gif panel search
*/

const searchGifPanel = (query: string): void => {
	$(".mtd-gif-column-1").empty();
	$(".mtd-gif-column-2").empty();

	$(".mtd-gif-no-results").addClass("hidden");

	isLoadingMoreGifs = true;

	let sanitiseQuery: string = query.replace(/\s/g,"+").replace(/\&/g,"&amp;").replace(/\?/g,"").replace(/\//g," OR ");
	lastQuery = sanitiseQuery;

	fetchAllSearch(query);
}

const fetchAllTrending = (): void => {
	if ($("[data-provider=tenor]").length <= 0) {
		lastTenorPos = "";
	}
	if ($("[data-provider=gfycat]").length <= 0) {
		lastGfycatPos = "";
	}

	lastGiphyURL = `https://api.giphy.com/v1/gifs/trending?api_key=${giphyKey}&limit=20&offset=${$("[data-provider=giphy]").length}`;
	lastTenorURL = `https://api.tenor.com/v1/trending?key=${tenorKey}&locale=${I18n.getFullLanguage()}&limit=20&pos=${lastTenorPos}`;
	lastGfycatURL = `https://api.gfycat.com/v1/gfycats/trending?count=20&lang=${I18n.getMainLanguage()}&cursor=${lastGfycatPos}`;

	console.log(lastGiphyURL);
	console.log(lastTenorURL);
	console.log(lastGfycatURL);

	fetchGiphy();
	fetchGfycat();
	fetchTenor();
}

const fetchAllSearch = (query: string): void => {
	if ($("[data-provider=tenor]").length <= 0) {
		lastTenorPos = "";
	}
	if ($("[data-provider=gfycat]").length <= 0) {
		lastGfycatPos = "";
	}

	lastGiphyURL = `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${giphyKey}&limit=20&offset=${$("[data-provider=giphy]").length}`;
	lastTenorURL = `https://api.tenor.com/v1/search?q=${query}&key=${tenorKey}&limit=20&locale=${I18n.getFullLanguage()}&pos=${lastTenorPos}`;
	lastGfycatURL = `https://api.gfycat.com/v1/gfycats/search?search_text=${query}&count=20&lang=${I18n.getMainLanguage()}&cursor=${lastGfycatPos}`;

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

const trendingGifPanel = (): void => {
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

const loadMoreGifs = (): void => {
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

export const checkGifEligibility = (): void => {
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
