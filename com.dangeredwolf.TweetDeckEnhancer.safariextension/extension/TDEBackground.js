// TDEBackground.js
// Copyright (c) 2015 Dangered Wolf

// Released under the MIT license

// Sharing functionality implemented thanks to some work by Eramdam!
// His original code was also released under the MIT license

if (chrome !== "undefined") {

    chrome.webRequest.onHeadersReceived.addListener(function(details) {

      if (details.type !== "main_frame") {
        return;
      }
      
      for (i = 0; i < details.responseHeaders.length; i++) { 
        if (typeof details.responseHeaders[i].name !== "undefined") {
          if (details.responseHeaders[i].name === "content-security-policy") {
            details.responseHeaders[i].value = "default-src 'self'; connect-src *; font-src 'self' https://fonts.gstatic.com https://dangeredwolf.com https://tweetdeckenhancer.com https://ton.twimg.com data:; frame-src https:; img-src https: data:; media-src *; object-src 'self' https://www.youtube.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://ajax.googleapis.com https://dangeredwolf.com https://tweetdeckenhancer.com https://*.twitter.com https://*.twimg.com https://ssl.google-analytics.com https://api-ssl.bitly.com; style-src 'self' 'unsafe-inline' https://ajax.googleapis.com https://dangeredwolf.com https://tweetdeckenhancer.com https://platform.twitter.com https://ton.twimg.com;";
          }
        }
      }

      return {responseHeaders:details.responseHeaders};
    }, {urls:["https://tweetdeck.twitter.com/*"]}, ["responseHeaders","blocking"]);

  chrome.webRequest.onBeforeRequest.addListener(function(details) {
      
      if (details.url.indexOf("app-dark") > -1 || details.url.indexOf("app-light") > -1) {
        return {cancel:true};
      }

      return;
    }, {urls:["https://ton.twimg.com/*"]}, ["blocking"]);

  /*function FindTab(urls,items) {
    var tabs = [];
    var windowcount = 0;

    chrome.windows.getAll(function(windows) {
      for (var i = 0; i < windows.length; i++) {
        chrome.tabs.getAllInWindow(windows[i].id, function(tabs) {
          windowcount++;
          allTheTabs = allTheTabs.concat(tabs);
          if (windowcount === windows.length) {
            openApp(urls,tabs,items);
          }
        });

      }
    });
  }

   function openApp(urls, tabs, itemInfos) {
    console.log("openApp", itemInfos.timestamp);
    // Search urls in priority order...
    for (var i = 0; i < urls.length; i++) {
      var url = urls[i];

      // Search tabs...
      for (var j = 0; j < tabs.length; j++) {
        var tab = tabs[j];
        if (tab.url.indexOf(url) === 0) {
          // Found it!
          var tabId = tab.id;
          chrome.windows.update(tab.windowId, {
            focused: true
          });
          chrome.tabs.update(tabId, {
            selected: true,
            active: true,
            highlighted: true
          }, function() {
            console.log("update", itemInfos.timestamp);
            var text = itemInfos.text;
            var url = itemInfos.url;
            chrome.tabs.sendMessage(tabId, {
              text: text,
              url: url,
              timestamp: itemInfos.timestamp,
              count: 2
            })
          });
          return;
        }
      }
    }


  function Share(shareme) {

  }

  chrome.contextMenus.create({
      "title": "Share on TweetDeck",
      "contexts": ["selection","image","page","link"],
      "onclick": Share
    });*/



}
