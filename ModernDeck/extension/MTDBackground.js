// MTDBackground.js
// Copyright (c) 2015 Dangered Wolf

// Released under the MIT license

if (chrome !== "undefined") {

    chrome.webRequest.onHeadersReceived.addListener(function(details) {


      if (details.type !== "main_frame" && details.type !== "sub_frame") {
        return;
      }

      for (i = 0; i < details.responseHeaders.length; i++) {
        if (typeof details.responseHeaders[i].name !== "undefined" && details.responseHeaders[i].name === "content-security-policy") {
          details.responseHeaders[i].value = "default-src 'self'; connect-src *; font-src 'self' https://fonts.gstatic.com https://dangeredwolf.com https://tweetdeckenhancer.com https://ton.twimg.com data:; frame-src https:; frame-ancestors 'self' https://*.twitter.com; img-src https: data:; media-src *; object-src 'self' https://www.youtube.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://ajax.googleapis.com https://dangeredwolf.com https://tweetdeckenhancer.com https://*.twitter.com https://*.twimg.com https://ssl.google-analytics.com https://api-ssl.bitly.com; style-src 'self' 'unsafe-inline' https://ajax.googleapis.com https://dangeredwolf.com https://tweetdeckenhancer.com http://tweetdeckenhancer.com https://platform.twitter.com https://ton.twimg.com;";
          return {responseHeaders:details.responseHeaders};
        }
      }

    }, {urls:["https://tweetdeck.twitter.com/*","https://twitter.com/i/cards/*"]}, ["responseHeaders","blocking"]);

  chrome.webRequest.onBeforeRequest.addListener(function(details) {

      if (details.url.indexOf(".css") > -1 && details.url.indexOf("tweetdeck") > -1) {
        return {cancel:true};
      }

      return;
    }, {urls:["https://ton.twimg.com/*"]}, ["blocking"]);

  chrome.runtime.onMessage.addListener(function(m){
    if (m == "getStorage") {
      chrome.storage.local.get(null, function(items){
        chrome.tabs.query({url: "https://tweetdeck.twitter.com/"}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, {"name": "sendStorage", "storage": items});
        });
      });
    } else if (m.name == "setStorage") {
      chrome.storage.local.set(m.content);
    }
  });
}
