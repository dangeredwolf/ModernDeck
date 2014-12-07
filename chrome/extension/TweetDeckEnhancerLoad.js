// TweetDeckEnhancerLoad.js
// Copyright (c) 2014 Ryan Dolan (ryandolan123)

var links = document.getElementsByTagName("link");

for (i = 0; i < links.length; i++) { 
    if (typeof links[i].href !== "undefined") {
    	if (links[i].href.substring(0,52) === "https://ton.twimg.com/tweetdeck-web/web/css/app-dark") {
    		links[i].href = chrome.extension.getURL("resources/app-dark.css"); // Inject custom style sheet (Dark Theme)
    	}
    	if (links[i].href.substring(0,53) === "https://ton.twimg.com/tweetdeck-web/web/css/app-light") {
    		links[i].href = chrome.extension.getURL("resources/app-light.css"); // Inject custom style sheet (Light Theme)
    	}
    }
}


console.log($)

setTimeout(function() {
	document.getElementsByTagName("html")[0].class = document.getElementsByTagName("html")[0].class + " ryandolan123TweetDeckEnhancerExtensionChrome"; // I thought += worked in javascript? guess not. Either isn't not or I am really bad at this
}, 1000);