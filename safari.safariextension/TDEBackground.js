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

console.log(chrome.webRequest);
console.log(chrome);

if (isChrome) {
  /*chrome.webRequest.onHeadersReceived.addListener(function(details) {
    
  },{urls: []});*/
    chrome.webRequest.onHeadersReceived.addListener(function(details) {
      /*details.responseHeaders = details.responseHeaders.concat(transformHeaders(getHeaders(/^backbone\.responseHeaders.+$/)));

      return { responseHeaders: details.responseHeaders };*/

      if (details.type !== "main_frame") {
        return
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
}
