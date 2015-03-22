// TDEBackground.js
// Copyright (c) 2015 Dangered Wolf

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

    chrome.webRequest.onHeadersReceived.addListener(function(details) {

      if (details.type !== "main_frame") {
        return;
      }

      console.log("Connecting to " + details.url + "...");

      for (i = 0; i < details.responseHeaders.length; i++) { 
        if (typeof details.responseHeaders[i].name !== "undefined") {
          if (details.responseHeaders[i].name === "content-security-policy") {
            console.log("Old content security policy: " + details.responseHeaders[i].value);
            console.log("Hijacking request to allow tweetdeck to access https://dangeredwolf.com...");
            details.responseHeaders[i].value = "default-src 'self'; connect-src *; font-src 'self' https://fonts.gstatic.com https://dangeredwolf.com https://ton.twimg.com data:; frame-src https:; img-src https: data:; media-src *; object-src 'self' https://www.youtube.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://ajax.googleapis.com https://dangeredwolf.com https://*.twitter.com https://*.twimg.com https://ssl.google-analytics.com https://api-ssl.bitly.com; style-src 'self' 'unsafe-inline' https://ajax.googleapis.com https://dangeredwolf.com https://platform.twitter.com https://ton.twimg.com;";
            console.log("New content security policy by me: " + details.responseHeaders[i].value);
            console.log("hehehe...");
          }
        }
      }

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

      return {responseHeaders:details.responseHeaders};
    }, {urls:["https://tweetdeck.twitter.com/*"]}, ["responseHeaders","blocking"]);

}
