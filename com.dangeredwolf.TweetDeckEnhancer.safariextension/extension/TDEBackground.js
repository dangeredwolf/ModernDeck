// TDEBackground.js
// Copyright (c) 2015 Dangered Wolf

if (chrome !== "undefined") {

    chrome.webRequest.onHeadersReceived.addListener(function(details) {

      if (details.type !== "main_frame") {
        return;
      }
      
      for (i = 0; i < details.responseHeaders.length; i++) { 
        if (typeof details.responseHeaders[i].name !== "undefined") {
          if (details.responseHeaders[i].name === "content-security-policy") {
            details.responseHeaders[i].value = "default-src 'self'; connect-src *; font-src 'self' https://fonts.gstatic.com https://dangeredwolf.com https://ton.twimg.com data:; frame-src https:; img-src https: data:; media-src *; object-src 'self' https://www.youtube.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://ajax.googleapis.com https://dangeredwolf.com https://*.twitter.com https://*.twimg.com https://ssl.google-analytics.com https://api-ssl.bitly.com; style-src 'self' 'unsafe-inline' https://ajax.googleapis.com https://dangeredwolf.com https://platform.twitter.com https://ton.twimg.com;";
          }
        }
      }

      return {responseHeaders:details.responseHeaders};
    }, {urls:["https://tweetdeck.twitter.com/*"]}, ["responseHeaders","blocking"]);

}
