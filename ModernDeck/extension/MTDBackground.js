// MTDBackground.js
// Copyright (c) 2019 Dangered Wolf

// Released under the MIT license

if (chrome !== "undefined") {

    chrome.webRequest.onHeadersReceived.addListener(function(details) {


      if (details.type !== "main_frame" && details.type !== "sub_frame") {
        return;
      }

      for (i = 0; i < details.responseHeaders.length; i++) {
        if (typeof details.responseHeaders[i].name !== "undefined" && details.responseHeaders[i].name === "content-security-policy") {
          details.responseHeaders[i].value = "default-src 'self'; connect-src *; font-src https: data: *; frame-src https:; frame-ancestors 'self' https:; img-src https: data:; media-src *; object-src 'self' https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://sentry.io https://cdn.jsdelivr.net https://ajax.googleapis.com https://dangeredwolf.com https://tweetdeckenhancer.com https://cdn.ravenjs.com/ https://*.twitter.com https://*.twimg.com https://rawgit.com https://*.rawgit.com https://ssl.google-analytics.com https://api-ssl.bitly.com; style-src 'self' 'unsafe-inline' https:;";
          return {responseHeaders:details.responseHeaders};
        }
      }

    }, {urls:["https://tweetdeck.twitter.com/*","https://twitter.com/i/cards/*"]}, ["responseHeaders","blocking"]);

  chrome.webRequest.onBeforeRequest.addListener(function(details) {

      if (details.url.indexOf(".css") > -1 && (details.url.indexOf("bundle") > -1 && details.url.indexOf("dist") > -1)) {
        return {cancel:true};
      }

      return;
    }, {urls:["https://ton.twimg.com/*"]}, ["blocking"]);

  chrome.runtime.onMessage.addListener(function(m){
  	console.log("Message received");
  	console.log(m);
    if (m == "getStorage") {
      chrome.storage.local.get(null, function(items){
        chrome.tabs.query({url: "https://tweetdeck.twitter.com/"}, function(tabs){
        	if (typeof tabs[0] !== "undefined") {
        		chrome.tabs.sendMessage(tabs[0].id, {"name": "sendStorage", "storage": JSON.stringify(items)});
        	} else {
        		chrome.tabs.sendMessage(tabs.id, {"name": "sendStorage", "message": JSON.stringify(items)});
        	}
          console.log("Reply sent");
          console.log(items);
        });
      });
    } else if (m.name == "setStorage") {
      chrome.storage.local.set(m.content);
    }
  });
}

