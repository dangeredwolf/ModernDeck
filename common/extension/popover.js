/*
	ITD.js
	Copyright (c) 2014-2020 dangered wolf, et al

	Released under the MIT licence
*/
window.open("https://tweetdeck.twitter.com");

var browser = browser || chrome;
const createNewTab = () => browser.tabs.create({url:"https://tweetdeck.twitter.com"}, a => close());

needsPermission.innerHTML = browser.i18n.getMessage("needsPermission");
needsPermissionParagraph.innerHTML = browser.i18n.getMessage("needsPermissionParagraph");
grantButton.innerHTML = browser.i18n.getMessage("grantButton");
grantButton.onclick = function() {
	browser.permissions.request({permissions:["tabs"]}, (res) => {
		createNewTab();
	})
}

browser.permissions.contains({permissions:["tabs"]}, (res) => {
	if (res) {
		createNewTab();
	} else {

	}
});
