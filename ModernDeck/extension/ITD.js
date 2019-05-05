var a = typeof browser !== "undefined" ? browser : chrome;
a.tabs.create({url:"https://tweetdeck.twitter.com"}, function(){})