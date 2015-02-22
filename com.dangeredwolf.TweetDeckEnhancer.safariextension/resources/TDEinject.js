// TDEinject.js
// Copyright (c) 2015 Ryan Dolan (ryandolan123)

(function() {

console.log("TDEinject loaded");

function WaitForTDToConfigureSelf(){
  if (typeof document.getElementsByClassName("app-signin-form")[0] !== "undefined") {
    document.getElementsByTagName("html")[0].setAttribute("class",document.getElementsByTagName("html")[0].getAttribute("class") + " signin-sheet-now-present");
    WaitForLogin();
  } else {
    if (typeof document.getElementsByClassName("app-content")[0] === "undefined") {
      setTimeout(WaitForTDToConfigureSelf,60);
    }
  }
}

function WaitForLogin() {
  if (typeof document.getElementsByClassName("app-signin-form")[0] === "undefined") {
    document.getElementsByTagName("html")[0].setAttribute("class",document.getElementsByTagName("html")[0].getAttribute("class").replace(" signin-sheet-now-present",""));
    return;
  } 
  setTimeout(WaitForLogin,500);
}

function WorldTick(){
  
  for (i = 0; i < document.getElementsByClassName("tweet-action-item position-rel").length; i++) { 
    document.getElementsByClassName("tweet-action-item position-rel")[i].removeChild = function(dropdown){
      dropdown.setAttribute("class",dropdown.getAttribute("class") + " tde-dropdown-fade-out");
      console.log("bye");
      setTimeout(function(){
        dropdown.remove();
      },200)
    }
  }

  for (i = 0; i < document.getElementsByClassName("js-action-header-button column-header-link column-settings-link").length; i++) { 
    document.getElementsByClassName("js-action-header-button column-header-link column-settings-link")[i].removeChild = function(dropdown){
      dropdown.setAttribute("class",dropdown.getAttribute("class") + " tde-dropdown-fade-out");
      console.log("bye");
      setTimeout(function(){
        dropdown.remove();
      },200)
    }
  }

  for (i = 0; i < document.getElementsByClassName("tweet-detail-action-item position-rel").length; i++) { 
    document.getElementsByClassName("tweet-detail-action-item position-rel")[i].removeChild = function(dropdown){
      dropdown.setAttribute("class",dropdown.getAttribute("class") + " tde-dropdown-fade-out");
      console.log("bye");
      setTimeout(function(){
        dropdown.remove();
      },200)
    }
  }

  for (i = 0; i < document.getElementsByClassName("app-navigator margin-bm padding-ts").length; i++) { 
    document.getElementsByClassName("app-navigator margin-bm padding-ts")[i].removeChild = function(dropdown){
      dropdown.setAttribute("class",dropdown.getAttribute("class") + " tde-dropdown-fade-out");
      console.log("bye");
      setTimeout(function(){
        dropdown.remove();
      },200)
    }
  }

  for (i = 0; i < document.getElementsByClassName("status-message").length; i++) { 
    if (typeof messagesAccounted[document.getElementsByClassName("status-message")[i]] === "undefined") {
      var thing = document.getElementsByClassName("status-message")[i];

      msgID++;

      SendNotificationMessage(thing.childNodes[1].innerHTML);
      WaitForNotificationDismiss(thing,msgID);

      messagesAccounted[document.getElementsByClassName("status-message")[i]] = true;
    }
  }

  setTimeout(WorldTick,400);
}


function PatchSystem() {
  /*if (typeof TD === "undefined") {
    setTimeout(PatchSystem,50);
    return;
  }
  if (typeof TD.storage === "undefined") {
    setTimeout(PatchSystem,50);
    return;
  }
  if (typeof TD.storage.store === "undefined") {
    setTimeout(PatchSystem,50);
    return;
  }
  if (typeof TD.storage.store.getCurrentAuthType === "undefined") {
    setTimeout(PatchSystem,50);
    return;
  }

  console.log("Executing AuthType patch...");

  TD.storage.store.getCurrentAuthType = function() {
    return "twitter";
  }*/

  if (typeof document.getElementsByClassName("js-modals-container")[0] === "undefined") {
    setTimeout(PatchSystem,50);
    return;
  }

  document.getElementsByClassName("js-modals-container")[0].removeChild = function(rmnode){
    if (typeof rmnode === "undefined") {
      console.log("what");
      return;
    }
    console.log("i am hooked bitch");
    rmnode.setAttribute("class","js-modal-context tde-modal-window-fade-out overlay overlay-super scroll-v");
    setTimeout(function(){rmnode.remove();},200);
  }

  console.log("patched system");

  return;
}

function Analytics() {
  if (typeof TD === "undefined") {
    setTimeout(Analytics,500);
    return;
  }
  if (typeof TD.storage === "undefined") {
    setTimeout(Analytics,500);
    return;
  }
  if (typeof TD.storage.store === "undefined") {
    setTimeout(Analytics,500);
    return;
  }
  if (typeof TD.storage.store._backend === "undefined") {
    setTimeout(Analytics,500);
    return;
  }
  if (typeof TD.storage.store._backend.tweetdeckAccount === "undefined") {
    setTimeout(Analytics,500);
    return;
  }
  if (typeof $ === "undefined") {
    setTimeout(Analytics,500);
    return;
  }
  if (typeof $.ajax === "undefined") {
    setTimeout(Analytics,500);
    return;
  }
  $.ajax({url:"https://ryandolan123.com/analytics/TDE4?acc=" + TD.storage.store._backend.tweetdeckAccount + "&v=4.3&codename=seadragon"});
}

function ReplaceLoadingIndicator() {
  if (typeof document.getElementsByClassName("app-signin-form")[0] !== "undefined") {
    return;
  }

  if (typeof document.getElementsByClassName("js-startflow-content startflow")[0] === "undefined") {
    setTimeout(ReplaceLoadingIndicator,30);
    return;
  }

  document.getElementsByClassName("js-startflow-content startflow")[0].innerHTML = '<video class="spinner-centered spinner-fade-in" width="74" height="76" src="https://ryandolan123.com/assets/tweetdeck/img/spinner.mov" autoplay loop></video>';
}

function TDESecureVerif() {
  injStyles = document.createElement("link");
  injStyles.rel = "stylesheet";
  injStyles.href = "https://ryandolan123.com/TweetDeckEnhancer/TDESecureVerified";
  document.head.appendChild(injStyles);
}

setTimeout(WaitForTDToConfigureSelf,0);
setTimeout(PatchSystem,1200); 
setTimeout(ReplaceLoadingIndicator,0);
setTimeout(WorldTick,0);
setTimeout(Analytics,3000);
setTimeout(TDESecureVerif,150);

})();

// TDE 4.3 SeaDragon x3