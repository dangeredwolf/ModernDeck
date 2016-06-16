try { 
    chrome.tabs.create({
        url: "https://tweetdeck.twitter.com",
        active: true,
    });
} catch (error) {
    console.log(error);
    document.getElementById("ITDLaunch").innerHTML = "Failed to Launch TweetDeck"
}