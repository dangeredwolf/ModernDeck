const toneMap = [
	"",
	"1f3fb",
	"1f3fc",
	"1f3fd",
	"1f3fe",
	"1f3ff"
]

let emojiBaseURL = "https://twemoji.maxcdn.com/v/12.1.5/svg/";

const parseOptions = {
	folder:"svg",
	callback:(icon,options,variant) => {
		switch (icon) {
			case "a9":	// © copyright
			case "ae":	// ® registered trademark
			case "2122":	 // ™ trademark
				return false;
		}
		return "".concat(options.base, options.size, "/", icon, options.ext);
	}
}

async function makeEmojiPicker() {

	if (nQuery(".mtd-emoji").length > 0) {
		// console.error("We already made the emoji panel. Please leave me alone.");
		return;
	}

	var searchBox = makeN("input").addClass("search").attr("placeholder","Search").attr("type","text").on("input", () => {
		let query = searchBox.val();

		if (query === "") {
			nQuery(`.mtd-emoji-category>.emojibtn`).removeClass("emojifadein emojifadeout");
			nQuery(`.mtd-emoji-category`).removeClass("hidden")
		}

		nQuery(`.mtd-emoji-category>.emojibtn`).each((i, a) => {
			let code = a.getAttribute("data-code");

			toneMap.forEach((b, j) => {
				if (j !== 0) {
					code = code.replace("-" + b, "");
				}
			});

			let kad = emojiKeywordsAndDescriptions[code];

			if (typeof kad === "undefined") {
				console.error("Undefined emoji: " + code);
				return;
			}

			let keywords = kad.keywords;

			try {
				if (keywords.match(query) !== null) {
					a.classList.remove("emojifadeout");
					a.classList.add("emojifadein");
				} else {
					a.classList.remove("emojifadein");
					a.classList.add("emojifadeout");
				}
			} catch(e) {

			}
		});

		nQuery(`.mtd-emoji-category`).each((i, a) => {
			if (nQuery(a.children).is(".emojifadein")) {
				a.classList.remove("emojihidecat");
			} else {
				a.classList.add("emojihidecat")
			}
		});
	})
	let search = makeN("div").addClass("mtd-emoji-search").append(searchBox);

	let tones = makeN("div").addClass("mtd-emoji-tones");
	makeTones(tones);

	let searchPanel = makeN("div").addClass("mtd-emoji-search-panel").append(search, tones);
	let filterCont = makeN("div").addClass("mtd-emoji-filters");
	let wrapper = makeN("div").addClass("mtd-emoji-wrapper").append(filterCont, searchPanel);
	let picker = makeN("div").addClass("mtd-emoji-picker popover hidden").append(wrapper);
	let cont = makeN("div").addClass("mtd-emoji").append(picker);
	makeFilters(filterCont);

	let categoryBlock = makeN("div").addClass("mtd-emoji-category-block");

	buildCategories(categoryBlock);

	let emojisList = makeN("div").addClass("mtd-emoji-emojis-list").append(categoryBlock);
	let scrollArea = makeN("div")
	.addClass("mtd-emoji-scroll-area scroll-v")
	.append(emojisList);

	picker.append(scrollArea);

	nQuery(".compose-text-container").append(cont);

	nQuery(".compose-text").after(
		makeN("div").addClass("mtd-emoji").append(
			makeN("div").addClass("mtd-emoji-button btn").append(
				makeN("div").addClass("mtd-emoji-button-open").click(() => {
					picker.toggleClass("hidden")
				})
			)
		)
	);

	updateRecentEmojis();
}

function convertPoint(codepoint) {
	return {
		supportsTones: codepoint.match(/\*/g) !== null,
		point:fromCodePoint(codepoint)
	}
}

function setTone(tone) {
	nQuery(`.mtd-emoji-category[name="people"]>.emojibtn,.mtd-emoji-category[name="recent"]>.emojibtn`).each((i, a) => {
		if (!a.getAttribute("data-code")) {
			return;
		}
		let data = a.getAttribute("data-code").replace(/(\*|\-$)/g,"");

		// Remove tone off of previously toned emojis
		toneMap.forEach((b, j) => {
			if (j !== 0) {
				data = data.replace("-" + b, "");
			}
		});


		// Is it an emoji that supports tones?
		if (emojiToneEmojis[data]) {
			// emoji contains more than 1 character, modifier or otherwise
			if (data.match("-") !== null) {
				data = data.replace("-", "-" + toneMap[tone] + "-").replace("--","-");
			} else {
				// emoji contains 1 character
				data = data + "-" + toneMap[tone];
			}

			// Remove trailing minus, if there
			data = data.replace(/\-$/g, "");

			console.log(convertPoint(data))
			console.log(convertPoint(data).point)

			a.innerHTML = twemoji.parse(convertPoint(data).point, parseOptions)
			a.setAttribute("data-code",data);
		}
	})
}

function makeFilters(filterCont) {
	emojiCategories.forEach((a, b) => {
		var filter = makeN("i")
		.addClass("mtd-emoji-filter" + (b === 0 ? " active" : ""))
		.data("filter",emojiCategories[b].id)
		.attr("title",emojiCategories[b].title)
		.append(
			twemoji.parse(convertPoint(emojiCategories[b].items[0] || "1f552").point, parseOptions)
		)
		.click(() => {
			let scrollArea = nQuery(".mtd-emoji-scroll-area");
			nQuery(".mtd-emoji-filter.active").removeClass("active");
			filter.addClass("active");

			var headerOffset = nQuery(".mtd-emoji-category[name='" + filter.data("filter") + "']").offset().top,
				scroll = scrollArea.scrollTop(),
				offsetTop = scrollArea.offset().top;

			scrollArea.stop().animate({
				scrollTop: headerOffset + scroll - offsetTop
			}, {
				duration: 250,
				easing: "easeOutQuint"
			});
		})
		filterCont.append(filter)

	});
}

function makeTones(tones) {
	for (let i = 0; i < 6; i++) {
		let tone = makeN("i").addClass("btn-tone btn-tone-" + i);
		if (i === 0) {
			tone.addClass("active");
		}
		tone.click(() => {
			nQuery(".btn-tone").removeClass("active");
			tone.addClass("active");
			setTone(i);
		});
		tones.append(tone);
	}
}

function updateRecentEmojis() {
	nQuery(`.mtd-emoji-category[name="recent"]>.emojibtn`).remove();

	let recentCategory = nQuery(`.mtd-emoji-category[name="recent"]`);
	let recents = getRecentEmojis();

	for (i in getRecentEmojis()) {
		recentCategory.append(makeEmojiButton(recents[i].codePointAt().toString(16)));
	}
}

function makeEmojiButton(emoji, title) {
	if (!window.emojiKeywordsAndDescriptions[emoji]) {
		console.log(emoji)
	}
	title = title || (window.emojiKeywordsAndDescriptions[emoji] ? window.emojiKeywordsAndDescriptions[emoji].description : "Emoji");
	// console.log(title)

	return `<i class="emojibtn" role="button" data-code="${emoji.replace(/\*/g,"")}" title="${title}">
		<img class="mtd-emoji-code" draggable="false" alt="${convertPoint(emoji)}" src="${emojiBaseURL}${emoji}.svg"></i>
	</i>`;
}

function buildCategories(categoryBlock) {
	emojiCategories.forEach((a, b) => {
		var category = makeN("div").addClass("mtd-emoji-category").attr("name", a.id);

		if (a.items.length <= 0) {
			updateRecentEmojis();
		} else {
			// a.items.forEach(emoji => {
			// 	category.append(makeEmojiButton(emoji));
			// });

			let innerHTML = `<div class="mtd-emoji-category-title txt-mute">${a.title}</div>`;

			for (let i = 0; i < a.items.length; i++) {
				innerHTML += makeEmojiButton(a.items[i]);
			}

			category.html(innerHTML);
		}

		categoryBlock.append(category)
	});
}
