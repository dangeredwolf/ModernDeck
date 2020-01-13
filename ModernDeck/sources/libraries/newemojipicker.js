const toneMap = [
	"",
	"1f3fb",
	"1f3fc",
	"1f3fd",
	"1f3fe",
	"1f3ff"
]

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

function makeEmojiPicker() {

	var searchBox = make("input").addClass("search").attr("placeholder","Search").attr("type","text").on("input", () => {
		let query = searchBox.val();

		if (query === "") {
			$(`.mtd-emoji-category>.emojibtn`).removeClass("emojifadein emojifadeout");
			$(`.mtd-emoji-category`).removeClass("hidden")
		}

		$(`.mtd-emoji-category>.emojibtn`).each((i, a) => {
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

			if (keywords.match(query) !== null) {
				a.classList.remove("emojifadeout");
				a.classList.add("emojifadein");
			} else {
				a.classList.remove("emojifadein");
				a.classList.add("emojifadeout");
			}
		});

		$(`.mtd-emoji-category`).each((i, a) => {
			if ($(a.children).is(".emojifadein")) {
				a.classList.remove("emojihidecat");
			} else {
				a.classList.add("emojihidecat")
			}
		});
	})
	let search = make("div").addClass("mtd-emoji-search").append(searchBox);

	let tones = make("div").addClass("mtd-emoji-tones");
	makeTones(tones);

	let searchPanel = make("div").addClass("mtd-emoji-search-panel").append(search, tones);
	let filterCont = make("div").addClass("mtd-emoji-filters");
	let wrapper = make("div").addClass("mtd-emoji-wrapper").append(filterCont, searchPanel);
	let picker = make("div").addClass("mtd-emoji-picker popover hidden").append(wrapper);
	let cont = make("div").addClass("mtd-emoji").append(picker);
	makeFilters(filterCont);

	let categoryBlock = make("div").addClass("mtd-emoji-category-block");

	buildCategories(categoryBlock);

	let emojisList = make("div").addClass("mtd-emoji-emojis-list").append(categoryBlock);
	let scrollArea = make("div")
	.addClass("mtd-emoji-scroll-area scroll-v")
	.append(emojisList);

	picker.append(scrollArea);

	$(".compose-text-container").append(cont);

	$(".compose-text").after(
		make("div").addClass("mtd-emoji").append(
			make("div").addClass("mtd-emoji-button btn").append(
				make("div").addClass("mtd-emoji-button-open").click(() => {
					picker.toggleClass("hidden")
				})
			)
		)
	);

	updateRecentEmojis();
}

function fromCodePoint(str) {
	let newStr = "";
	str.replace(/\*/g,"").split("-").forEach(
		a => {newStr += twemoji.convert.fromCodePoint(a);}
	)
	return newStr;
}

function convertPoint(codepoint) {
	return {
		supportsTones: codepoint.match(/\*/g) !== null,
		point:fromCodePoint(codepoint)
	}
}

function setTone(tone) {
	$(`.mtd-emoji-category[name="people"]>.emojibtn,.mtd-emoji-category[name="recent"]>.emojibtn`).each((i, a) => {
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

			a.innerHTML = "";
			a.setAttribute("data-code",data);

			$(a).append(
				twemoji.parse(convertPoint(data).point, parseOptions)
			)
		}
	})
}

function makeFilters(filterCont) {
	emojiCategories.forEach((a, b) => {
		var filter = make("i")
		.addClass("mtd-emoji-filter" + (b === 0 ? " active" : ""))
		.data("filter",emojiCategories[b].id)
		.attr("title",emojiCategories[b].title)
		.append(
			twemoji.parse(convertPoint(emojiCategories[b].items[0] || "1f552").point, parseOptions)
		)
		.click(() => {
			let scrollArea = $(".mtd-emoji-scroll-area");
			$(".mtd-emoji-filter.active").removeClass("active");
			filter.addClass("active");

			var headerOffset = $(".mtd-emoji-category[name='" + filter.data("filter") + "']").offset().top,
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
		let tone = make("i").addClass("btn-tone btn-tone-" + i);
		if (i === 0) {
			tone.addClass("active");
		}
		tone.click(() => {
			$(".btn-tone").removeClass("active");
			tone.addClass("active");
			setTone(i);
		});
		tones.append(tone);
	}
}

function updateRecentEmojis() {
	$(`.mtd-emoji-category[name="recent"]>.emojibtn`).remove();

	let recentCategory = $(`.mtd-emoji-category[name="recent"]`);
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
	var emojibtn = make("i").addClass("emojibtn").attr("role","button").attr("data-code",emoji.replace(/\*/g,"")).append(
		twemoji.parse(
			convertPoint(emoji).point,
			parseOptions
		)
	).attr("title", title);

	emojibtn.click(() => {
		let theEmoji = fromCodePoint(emojibtn.attr("data-code"));//twemoji.convert.fromCodePoint(emoji);
		let theInput = $(".compose-text")[0];
		let oS = theInput.scrollTop;

		if (!emojibtn.is(`.mtd-emoji-category[name="recent"]>.emojibtn`))
			pushRecentEmoji(theEmoji);

		if (theInput.setSelectionRange) {
			let sS = theInput.selectionStart;
			let sE = theInput.selectionEnd;
			theInput.value = theInput.value.substr(0, sS) + theEmoji + theInput.value.substr(sE);
			theInput.setSelectionRange(sS + theEmoji.length, sS + theEmoji.length);
		} else if (theInput.createTextRange) {
			document.selection.createRange().text = theEmoji;
		}

		theInput.focus();
		theInput.scrollTop = oS;
	});

	return emojibtn;
}

function pushRecentEmoji(emoji) {
	let recents = getPref("mtd_recent_emoji", "").split("|").filter(o => o !== emoji);

	// maximum 24
	if (recents.length >= 24) {
		recents.pop();
	}

	setPref("mtd_recent_emoji", emoji + "|" + recents.join("|"));

	updateRecentEmojis();
}

function getRecentEmojis() {
	let asdf = getPref("mtd_recent_emoji", "").split("|");
	if (asdf[asdf.length - 1] === "")
		asdf.pop();
	return asdf;
}

function buildCategories(categoryBlock) {
	emojiCategories.forEach((a, b) => {
		let categoryTitle = make("div").addClass("mtd-emoji-category-title txt-mute").html(a.title);
		let category = make("div").addClass("mtd-emoji-category").attr("name", a.id).append(categoryTitle);

		if (a.items.length <= 0) {
			updateRecentEmojis();
		} else {
			a.items.forEach(emoji => {
				category.append(makeEmojiButton(emoji));
			});
		}

		categoryBlock.append(category)
	});
}
