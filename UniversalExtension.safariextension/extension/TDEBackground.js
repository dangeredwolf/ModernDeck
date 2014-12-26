// TDEBackground.js
// Copyright (c) 2014 Ryan Dolan (ryandolan123)

if (typeof safari !== "undefined") {
  var isSafari = true;
  chrome = [];
  chrome.extension = [];
  chrome.extension.getURL = function(url){return safari.extension.baseURI + url;} //wow i am lazy
}

if (typeof chrome !== "undefined") {
  var isChrome = true;
}

if (isChrome) {
  /*chrome.webRequest.onHeadersReceived.addListener(function(details) {

  },{urls: []});*/

    chrome.runtime.onInstalled.addListener(function(details){
      if (details.reason == "install") {
       chrome.tabs.create({
          url:"https://tweetdeck.twitter.com",
          active:true
         },function(){});
      }
      else
      if (details.reason == "update") {
          var thisVersion = chrome.runtime.getManifest().version;
          console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
      }
    });

    chrome.webRequest.onHeadersReceived.addListener(function(details) {
      /*details.responseHeaders = details.responseHeaders.concat(transformHeaders(getHeaders(/^backbone\.responseHeaders.+$/)));

      return { responseHeaders: details.responseHeaders };*/

      if (details.type !== "main_frame") {
        return;
      }

      console.log("Connecting to " + details.url + "...");
      //console.log(details);

      for (i = 0; i < details.responseHeaders.length; i++) { 
        //console.log(details.responseHeaders[i]);
        if (typeof details.responseHeaders[i].name !== "undefined") {
          //console.log(details.responseHeaders[i]);
          //console.log(details.responseHeaders[i].name);
          if (details.responseHeaders[i].name === "content-security-policy") {
            console.log("Old content security policy: " + details.responseHeaders[i].value);
            console.log("Hijacking request to allow tweetdeck to access https://ryandolan123.com...");
            details.responseHeaders[i].value = "default-src 'self'; connect-src *; font-src 'self' https://fonts.gstatic.com https://ryandolan123.com https://ton.twimg.com data:; frame-src https:; img-src https: data:; media-src *; object-src 'self' https://www.youtube.com; script-src 'self' 'unsafe-eval' https://ryandolan123.com https://*.twitter.com https://*.twimg.com https://ssl.google-analytics.com https://api-ssl.bitly.com; style-src 'self' 'unsafe-inline' https://ryandolan123.com https://platform.twitter.com https://ton.twimg.com;";
            console.log("New content security policy by me: " + details.responseHeaders[i].value);
            console.log("hehehe...");
          }
        }
      }

      return {responseHeaders:details.responseHeaders};
    }, {urls:["https://tweetdeck.twitter.com/*"]}, ["responseHeaders","blocking"]);

chrome.webRequest.onCompleted.addListener(function(details) { // Incomplete right now. Will be used to change TweetDeck favicon. Will be finished before the next stable release.
      if (details.url.indexOf("favicon") > -1) {

      }
    }, {urls:["https://ton.twimg.com/tweetdeck-web/web/assets/logos/*"]}, ["responseHeaders","blocking"]);
}
