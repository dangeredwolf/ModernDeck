/*
	ITD.js
	Copyright (c) 2014-2020 dangered wolf, et al

	Released under the MIT licence
*/


var browser = browser || chrome;
const createNewTab = () => browser.tabs.create({url:"https://tweetdeck.twitter.com"}, a => {});

browser.permissions.remove({permissions:["tabs"]})

browser.permissions.contains({permissions:["tabs"]}, (res) => {
	if (res) {
		createNewTab();
	} else {
		browser.permissions.request({permissions:["tabs"]}, (res) => {
			createNewTab();
		})
	}
})
