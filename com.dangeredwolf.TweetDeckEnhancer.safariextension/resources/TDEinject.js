// TDEinject.js
// Copyright (c) 2015 Dangered Wolf

(function() { // Additional security to prevent other extensions and website code from tampering with TDE

console.log("TDEinject loaded");

var msgID = 0;
var messagesAccounted = [];

var ShouldUpgrade = false;

var addedColumnsLoadingTagAndIsWaiting = false;
var TDEBaseURL = "https://dangeredwolf.com/assets/tdetest/";

if (typeof window.TDEURLExchange !== "undefined") {
  if (typeof TDEURLExchange.getAttribute === "function") {
    if (TDEURLExchange.getAttribute.toString() === "function getAttribute() { [native code] }") {
      if (typeof TDEURLExchange.getAttribute("type") === "string") {
        console.log("completed integrity check");
        TDEBaseURL = TDEURLExchange.getAttribute("type");
      }
    }
  }
} else {
  console.log("TDEURLExchange failed :( defaulting to stream fonts, may not work... but we'll try...");
}

function PatchAudio(){
  var AudioSources = document.getElementsByTagName("source");

  for (i = 0; i < AudioSources.length; i++) { 
    AudioSources[i].remove();
  }

  var NotificationSound = document.getElementsByTagName("audio")[0];
  NotificationSound.src = "https://dangeredwolf.com/assets/tweetdeck/img/alert_2.mp3";
}

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

function StreamAngularJS() {

  if (!ShouldUpgrade) {
    return;
  }

  // TDE now uses Angular JS for other nice material things


  // AngularJS Material Stylesheet

  var angularstyles = document.createElement("link");
  angularstyles.rel = "stylesheet";
  angularstyles.href = "//ajax.googleapis.com/ajax/libs/angular_material/0.6.1/angular-material.min.css";
  angularstyles.id = "angularstyles";
  document.head.appendChild(angularstyles);

  // AngularJS / AngularJS Material Scripts

  var injectAngularJS = document.createElement("script");
  injectAngularJS.type = "text/javascript";
  injectAngularJS.src = "//cdn.jsdelivr.net/hammerjs/2.0.4/hammer.min.js";
  injectAngularJS.id = "injectAngularJS";
  document.body.appendChild(injectAngularJS);

  var injectAngularJS2 = document.createElement("script");
  injectAngularJS2.type = "text/javascript";
  injectAngularJS2.src = "//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular.min.js";
  injectAngularJS2.id = "injectAngularJS2";
  document.body.appendChild(injectAngularJS2);

  var injectAngularJS3 = document.createElement("script");
  injectAngularJS3.type = "text/javascript";
  injectAngularJS3.src = "//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular-animate.min.js";
  injectAngularJS3.id = "injectAngularJS3";
  document.body.appendChild(injectAngularJS3);

  var injectAngularJS4 = document.createElement("script");
  injectAngularJS4.type = "text/javascript";
  injectAngularJS4.src = "//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular-aria.min.js";
  injectAngularJS4.id = "injectAngularJS4";
  document.body.appendChild(injectAngularJS4);

  var injectAngularJS5 = document.createElement("script");
  injectAngularJS5.type = "text/javascript";
  injectAngularJS5.src = "//ajax.googleapis.com/ajax/libs/angular_material/0.6.1/angular-material.min.js";
  injectAngularJS5.id = "injectAngularJS5";
  document.body.appendChild(injectAngularJS5);

}

function WaitForLogin() {
  if (typeof document.getElementsByClassName("app-signin-form")[0] === "undefined") {
    document.getElementsByTagName("html")[0].setAttribute("class",document.getElementsByTagName("html")[0].getAttribute("class").replace(" signin-sheet-now-present",""));
    return;
  } 
  setTimeout(WaitForLogin,500);
}

function SendNotificationMessage(txt) {
  if (TDENotification.className === "tde-appbar-notification") {
    TDENotification.className = "tde-appbar-notification tde-appbar-notification-hidden";
    setTimeout(function(){
      TDENotification.className = "tde-appbar-notification";
      TDENotification.innerHTML = txt;
    },300);
  } else {
    TDENotification.className = "tde-appbar-notification";
    TDENotification.innerHTML = txt;
  }
  //http://materializecss.com/getting-started.html

}

function InjectRobotoFonts() {
  InjectFonts = document.createElement("style");
  InjectFonts.innerHTML = "@font-face{font-family:'RobotoDraft';font-style:normal;font-weight: 300;src:local('RobotoDraft Light'),local('RobotoDraft-Light'),url(" + TDEBaseURL + "resources/fonts/Roboto300latinext.woff2" + ") format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+20AD-20CF,U+2C60-2C7F,U+A720-A7FF;}@font-face{font-family:'RobotoDraft';\
    font-style: normal;\
    font-weight: 300;\
    src: local('RobotoDraft Light'), local('RobotoDraft-Light'), url(" + TDEBaseURL + "resources/fonts/Roboto300latin.woff2" + ") format('woff2');\
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
  }\
  /* latin-ext */\
  @font-face {\
    font-family: 'RobotoDraft';\
    font-style: normal;\
    font-weight: 400;\
    src: local('RobotoDraft'), local('RobotoDraft-Regular'), url(" + TDEBaseURL + "resources/fonts/Roboto400latinext.woff2" + ") format('woff2');\
    unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
  }\
  /* latin */\
  @font-face {\
    font-family: 'RobotoDraft';\
    font-style: normal;\
    font-weight: 400;\
    src: local('RobotoDraft'), local('RobotoDraft-Regular'), url(" + TDEBaseURL + "resources/fonts/Roboto400latin.woff2" + ") format('woff2');\
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
  }\
  /* latin-ext */\
  @font-face {\
    font-family: 'RobotoDraft';\
    font-style: normal;\
    font-weight: 500;\
    src: local('RobotoDraft Medium'), local('RobotoDraft-Medium'), url(" + TDEBaseURL + "resources/fonts/Roboto500latinext.woff2" + ") format('woff2');\
    unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
  }\
  /* latin */\
  @font-face {\
    font-family: 'RobotoDraft';\
    font-style: normal;\
    font-weight: 500;\
    src: local('RobotoDraft Medium'), local('RobotoDraft-Medium'), url(" + TDEBaseURL + "resources/fonts/Roboto500latin.woff2" + ") format('woff2');\
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
  }\
  /* latin-ext */\
  @font-face {\
    font-family: 'RobotoDraft';\
    font-style: normal;\
    font-weight: 700;\
    src: local('RobotoDraft Bold'), local('RobotoDraft-Bold'), url(" + TDEBaseURL + "resources/fonts/Roboto700latinext.woff2" + ") format('woff2');\
    unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
  }\
  /* latin */\
  @font-face {\
    font-family: 'RobotoDraft';\
    font-style: normal;\
    font-weight: 700;\
    src: local('RobotoDraft Bold'), local('RobotoDraft-Bold'), url(" + TDEBaseURL + "resources/fonts/Roboto700latin.woff2" + ") format('woff2');\
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
  }";

  document.head.appendChild(InjectFonts);

}

function WaitForNotificationDismiss(node,prevmsgID) {
  console.log("waiting for notification to gtfo (id=" + prevmsgID + ")");
  console.log(node);
  console.log(node.parentNode)
  if (typeof node === "undefined" || node === null || typeof node.parentNode === "undefined" || node.parentNode === null) {
    if (msgID === prevmsgID) {
      TDENotification.className = "tde-appbar-notification tde-appbar-notification-hidden";
      messagesAccounted[node] = undefined;
      return;
    } else {
      return;
    }
  }

  setTimeout(function(){WaitForNotificationDismiss(node,prevmsgID);},200);
}

function WorldTick(){
  
  for (i = 0; i < document.getElementsByClassName("tweet-action-item position-rel").length; i++) { 
    document.getElementsByClassName("tweet-action-item position-rel")[i].removeChild = function(dropdown){
      dropdown.setAttribute("class",dropdown.getAttribute("class") + " tde-dropdown-fade-out");
      setTimeout(function(){
        dropdown.remove();
      },200)
    }
  }

  for (i = 0; i < document.getElementsByClassName("tweet-detail-action-item position-rel").length; i++) { 
    document.getElementsByClassName("tweet-detail-action-item position-rel")[i].removeChild = function(dropdown){
      dropdown.setAttribute("class",dropdown.getAttribute("class") + " tde-dropdown-fade-out");
      setTimeout(function(){
        dropdown.remove();
      },200)
    }
  }

  for (i = 0; i < document.getElementsByClassName("app-navigator margin-bm padding-ts").length; i++) { 
    document.getElementsByClassName("app-navigator margin-bm padding-ts")[i].removeChild = function(dropdown){
      dropdown.setAttribute("class",dropdown.getAttribute("class") + " tde-dropdown-fade-out");
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

  

  setTimeout(WorldTick,200);
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

  /*if (!addedColumnsLoadingTagAndIsWaiting) {
    document.getElementsByTagName("html")[0].setAttribute("class",document.getElementsByTagName("html")[0].getAttribute("class") + " tde-columns-loading");
    addedColumnsLoadingTagAndIsWaiting = true;
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
    rmnode.setAttribute("class","js-modal-context tde-modal-window-fade-out overlay overlay-super scroll-v");
    setTimeout(function(){rmnode.remove();},200);
  }

  document.body.removeChild = function(i) {
    if (typeof i.getAttribute("class") !== "undefined" && i.getAttribute("class") !== null && i.getAttribute("class").indexOf("tooltip") > -1) {
      setTimeout(function(){
        i.remove(); // Tooltips automatically animate themselves out. But here we clean them up as well ourselves.
      },500);
    }
    else {
     i.remove();
    }
   }

   setTimeout(function(){
    /*var step = 0;
    console.log(document.getElementsByClassName("column"));
    var columns = document.getElementsByClassName("column");
    for (i = 0; i < columns.length; i++) { 
      setTimeout(function(){
        columns[step].setAttribute("class",columns[step].getAttribute("class") + " animatecolumnin");
        step++;
        console.log((new Date()).getSeconds());
      },300 * i);
    }*/
      setTimeout(function(){
        document.getElementsByTagName("html")[0].setAttribute("class",document.getElementsByTagName("html")[0].getAttribute("class").replace(" tde-columns-loading",""));
      //},300*columns.length);
    },800);
   },0); //1200

  return;
}

function DisplayMigrateUI1() {
  StreamAngularJS();
  document.getElementsByTagName("html")[0].className += " tde-is-upgrading ";
  setTimeout(DisplayMigrateUI2,2000);
}

function DisplayMigrateUI2() {
  document.getElementsByClassName("js-app-loading")[0].innerHTML = '<div class="mdl s-fluid tde-upgrading"><div class="mdl-header"></div><div class="mdl-inner"><div class="mdl-content"><md-progress-circular md-mode="indeterminate" aria-valuemin="0" aria-valuemax="100" role="progressbar" class="md-default-theme" style="-webkit-transform: scale(1);"><div class="md-spinner-wrapper"><div class="md-inner"><div class="md-gap"></div><div class="md-left"><div class="md-half-circle"></div></div><div class="md-right"><div class="md-half-circle"></div></div></div></div></md-progress-circular><h2>Enhancer is Upgrading...</h2><h3>Personalizing Enhancer</h3><div class="whatever"></div></div></div></div>';
}

function CheckForNeedsUpgrade() {
  if (ShouldUpgrade) {
    setTimeout(DisplayMigrateUI1,1000);
  }
}

function ReplaceLoadingIndicator() {
  if (typeof document.getElementsByClassName("app-signin-form")[0] !== "undefined") {
    return;
  }

  if (window.tde5loadingreplaced) {
    console.log("we're too late, bye");
    return;
  }

  if (typeof document.getElementsByClassName("js-startflow-content startflow")[0] === "undefined") {
    setTimeout(ReplaceLoadingIndicator,30);
    return;
  }

  {return;} // what

  //document.getElementsByClassName("js-startflow-content startflow")[0].innerHTML = '<video class="spinner-centered spinner-fade-in" width="74" height="76" src="https://dangeredwolf.com/assets/tweetdeck/img/spinner.mov" autoplay loop></video>';
}

function Analytics(ver) {
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
  $.ajax({url:"https://dangeredwolf.com/analytics/TDE5?acc=" + TD.storage.store._backend.tweetdeckAccount + "&developerpreview=8.1&intcodename=Paradise&ver=" + ver.toString()});
}

function ImJustKidding(tdesettingsmodalview){
  console.log("activate super easter egg powers");
  if (typeof tdesettingsmodalview !== "undefined") {
    tdesettingsmodalview.click();
  }
  setTimeout(function(){
    document.getElementsByClassName("js-header-add-column")[0].click(); // Click add column
    document.getElementsByClassName("js-item-launch")[9].childNodes[1].click(); // Click the user tweets button
  },100);
  setTimeout(function(){
    $(".lst-group")[2].remove();
    document.getElementsByClassName("js-add-column-search-input")[0].value = "enhancerint";
    $(".js-modal-panel.mdl.s-tall-fixed.is-inverted-dark .js-back").remove();
    $(".js-modal-panel.mdl.s-tall-fixed.is-inverted-dark")[0].style.cssText = "height:750px;";
  },200);
  setTimeout(function(){
    $(".mdl .js-perform-search.search-input-perform-search").click();
  },230)
  setTimeout(function(){
    $(".lst-group .js-list-container li .list-account")[0].click();
    $(".lst-group .js-list-container li .list-account")[0].click();
    $(".lst-group .js-list-container li .list-account")[0].click();
    $(".js-title")[0].remove();
  },1500);
  setTimeout(function(){
    if (typeof $(".mdl .stream-item[data-key='569320189801705472']") !== "undefined") {
      $(".mdl .stream-item[data-key='569320189801705472'] .item-box")[0].click();
    }
  },2600);
}

function PrepareLoginStuffs() {
  document.getElementsByClassName("js-header-add-column")[0].click(); // Click add column
  document.getElementById("open-modal").setAttribute("style","display:none;"); // Prevent modal from showing up
  document.getElementsByClassName("js-item-launch")[9].childNodes[1].click(); // Click the user tweets button
  document.getElementById("open-modal").setAttribute("style","display:none;"); // Hide tweets modal

  setTimeout(function(){ // Check out tweets
    document.getElementById("open-modal").setAttribute("style","display:none;"); // not sure exactly why i have to do this, probably for loading, but okay
  },0);

  setTimeout(function(){ // Check out tweets
    document.getElementById("open-modal").setAttribute("style","display:none;"); // not sure exactly why i have to do this, probably for loading, but okay
  },100);

  setTimeout(LoginStuffs2,150);
}

function LoginStuffs2() {
  if (typeof document.getElementsByClassName("js-right-column")[0] === "undefined") {
    setTimeout(LoginStuffs2,150);
    return;
  }
  document.getElementsByClassName("js-right-column")[0].childNodes[0].childNodes[1].childNodes[1].childNodes[3] // continued next line
  .childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[3].click(); // eww; basically finds most recent tweet so it can fetch profile

  document.getElementsByClassName("js-click-trap")[0].setAttribute("style","display:none;"); // Hide profile thing
  setTimeout(function(){
    document.getElementsByClassName("js-click-trap")[0].setAttribute("style","display:none;"); // Hide profile thing
  },0);
  setTimeout(function(){
    document.getElementsByClassName("js-click-trap")[0].setAttribute("style","display:none;"); // Hide profile thing
  },50);

  setTimeout(LoginStuffs3,150);
}

function LoginStuffs3() {
  if (typeof document.getElementsByClassName("prf-header")[0] === "undefined") {
    setTimeout(LoginStuffs3,150);
    return;
  }
  tde_nd_header_image.setAttribute("style",document.getElementsByClassName("prf-header")[0].style.cssText); // Fetch header and place in nav drawer
  tde_nd_header_photo.setAttribute("src",document.getElementsByClassName("prf-img")[0].childNodes[1].src); // Fetch profile picture and place in nav drawer
  tde_nd_header_username.innerHTML = document.getElementsByClassName("prf-card-inner")[0].childNodes[1].childNodes[5].childNodes[0].textContent; // Fetch twitter handle and place in nav drawer
  Analytics(!!document.getElementsByClassName("sprite-verified")[0]); // Collect basic analytics data (doesn't log usage or other sensitive information)
}

function NavigationSetup() {
  if (typeof document.getElementsByClassName("app-header-inner")[0] === "undefined") {
    setTimeout(NavigationSetup,100);
    return;
  }

  var TDENavigationDrawerButton = document.createElement("a");
  TDENavigationDrawerButton.id = "tde-navigation-drawer-button";
  TDENavigationDrawerButton.setAttribute("class","js-header-action tde-drawer-button link-clean cf app-nav-link");
  TDENavigationDrawerButton.innerHTML = '<div class="obj-left"> <img src="https://dangeredwolf.com/assets/TDE5/navbutton.png" class="tde-nav-activator"> </div> <div class="nbfc padding-ts hide-condensed"></div>'; // temporarily a settings icon, ill make an icon later

  document.getElementsByClassName("app-header-inner")[0].appendChild(TDENavigationDrawerButton);



  TDENavigationDrawerButton.onclick = function(){
    // TODO: Wire button to open navigation drawer
    if (typeof tde_nav_drawer_background !== "undefined") {
      tde_nav_drawer_background.setAttribute("class","tde-nav-drawer-background");
    }
    if (typeof tde_nav_drawer !== "undefined") {
      tde_nav_drawer.setAttribute("class","tde-nav-drawer");
    }
  };

  var TDENavigationDrawer = document.createElement("div");
  TDENavigationDrawer.id = "tde_nav_drawer";
  TDENavigationDrawer.setAttribute("class","tde-nav-drawer tde-nav-drawer-hidden");
  TDENavigationDrawer.innerHTML = '<img id="tde_nd_header_image" class="tde-nd-header-image"><img class="avatar size73 tde-nd-header-photo" id="tde_nd_header_photo"><div class="tde-nd-header-username" id="tde_nd_header_username"></div><button class="btn tde-nav-button tde-settings-button" id="tdset"><img src="https://dangeredwolf.com/assets/TDE5/tweetdecksmall.png" class="tde-nav-drawer-icon">TweetDeck Settings</button><button class="btn tde-nav-button" id="tdesettings"><img src="https://dangeredwolf.com/assets/TDE5/TDEsmall.png" class="tde-nav-drawer-icon">Enhancer Settings</button><div class="tde-nav-divider"></div><button id="tde_signout" class="btn tde-nav-button"><img src="https://dangeredwolf.com/assets/TDE5/logout.png" class="tde-nav-drawer-icon">Sign Out</button><button id="tdaccsbutton" class="btn tde-nav-button"><img src="https://dangeredwolf.com/assets/TDE5/accounts.png" class="tde-nav-drawer-icon">Your Accounts</button><div class="tde-nav-divider"></div><button id="kbshortcuts" class="btn tde-nav-button"><img src="https://dangeredwolf.com/assets/TDE5/KBshortcuts.png" class="tde-nav-drawer-icon">Keyboard Shortcuts</button><button id="addcolumn" class="btn tde-nav-button"><img src="https://dangeredwolf.com/assets/TDE5/AddColumn.png" class="tde-nav-drawer-icon">Add Column</button>';

  document.body.appendChild(TDENavigationDrawer);

  if (typeof tde_nd_header_image !== "undefined") {
    tde_nd_header_image.setAttribute("style","background:#00BCD4");
  }

  if (typeof tde_nd_header_photo !== "undefined") {
    tde_nd_header_photo.setAttribute("src","");
  }

  if (typeof tde_nd_header_username !== "undefined") {
    tde_nd_header_username.innerHTML = "Loading..."
  }

  setTimeout(PrepareLoginStuffs,0);

  window.TDEPrepareWindows = function() {
    document.getElementById("update-sound").click();

    for (i = 0; i < document.getElementsByClassName("js-click-trap").length; i++) { 
      document.getElementsByClassName("js-click-trap")[i].click();
    }

    tde_nav_drawer_background.click();
  }

  tdset.onclick = function(){
    TDEPrepareWindows();
    
    setTimeout(function(){
      document.getElementsByClassName("js-app-settings")[0].click();
    },25);
    setTimeout(function(){
      document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes[document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[7].childNodes[1].click();
    },50); 
  }

  tdesettings.onclick = function() {
    TDEPrepareWindows();
    var tdesettingsmodalview = document.getElementById("settings-modal");
    tdesettingsmodalview.innerHTML = '<div class="js-modal-panel mdl s-short is-inverted-dark" id="tde_settings_modal_panel"> <header class="js-mdl-header mdl-header"> <h3 class="mdl-header-title">Enhancer Settings</h3> </header> <div class="mdl-inner"> <div class="mdl-content js-mdl-content horizontal-flow-container"> <div class="l-column mdl-column mdl-column-sml"> <div class="l-column-scrollv scroll-v  scroll-alt "> <ul class="lst-group js-setting-list">  <li class="selected"><a href="#" class="list-link" id="enhancer_settings_about_button" data-action="general"><strong>About</strong></a></li></ul> </div> </div> <div class="l-column mdl-column mdl-column-lrg"> <div class="l-column-scrollv scroll-v  scroll-alt mdl-col-settings"> <form action="#" id="global-settings" accept-charset="utf-8" class="frm"><fieldset id="general_settings"><img src="https://dangeredwolf.com/assets/TDE5/tdeaboutsmaller.png" class="tde-logo"><h1 class="list-placeholder tde-about-title">TweetDeck Enhancer</h1><h2 class="tde-version-title">Version 5.0 '/*"Paradise"*/+' Developer Preview 8.1</h2></fieldset></form> </div> </div> </div> <footer class="padding-vxl txt-center">  <button class="js-dismiss btn btn-positive"> <i class="icon icon-check icon-small padding-rs"></i> <span class="label">Done</span> </button>  </footer> </div> </div>';
    tdesettingsmodalview.setAttribute("style","display:block;");
    tdesettingsmodalview.onclick = function() {
      if (typeof tde_settings_modal_panel !== "undefined") {
        tde_settings_modal_panel.setAttribute("class","js-modal-panel mdl s-short is-inverted-dark tde-modal-window-fade-out");
        tdesettingsmodalview.setAttribute("style","display: none;");
        setTimeout(function(){
          if (typeof tde_settings_modal_panel !== "undefined") {
            tde_settings_modal_panel.remove();
          }
        },600)
      }
    }
    window.tdeblah = false;
    $("#enhancer_settings_about_button").on("mousedown",function() {
      console.log("down!!");
      window.tdeblah = true;
      setTimeout(function(){
        if (window.tdeblah === true) {
          console.log("sweet!!!");
          ImJustKidding(tde_settings_modal_panel);
        }
      },2000)
    });
    $("#enhancer_settings_about_button").on("mouseup",function() {
      window.tdeblah = false;
      console.log("up!!");
    });
  }

  kbshortcuts.onclick = function(){
    TDEPrepareWindows();
    
    setTimeout(function(){
      document.getElementsByClassName("js-app-settings")[0].click();
    },25);
    setTimeout(function(){
      document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes[document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[5].childNodes[1].click();
    },50); 
  }

  addcolumn.onclick = function(){
    TDEPrepareWindows();
    
    setTimeout(function(){
      document.getElementsByClassName("js-header-add-column")[0].click();
    },50);
  }

  tdaccsbutton.onclick = function(){
    TDEPrepareWindows();
    
    setTimeout(function(){
      document.getElementsByClassName("js-show-drawer js-header-action")[0].click();
    },50);
  }

  tde_signout.onclick = function(){
    TDEPrepareWindows();

    setTimeout(function(){
      document.getElementsByClassName("js-app-settings")[0].click();
    },25);

    if (parseInt(TD.storage.store._backend.tweetdeckAccount).toString() === "NaN") {
      setTimeout(function(){
        document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes[document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[15].childNodes[1].click(); // TODO: Add TD acc check and make it click childNodes[13] instead of childNodes[11]
      },50); 
    } else {
      setTimeout(function(){
        document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes[document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[11].childNodes[1].click(); // TODO: Add TD acc check and make it click childNodes[13] instead of childNodes[11]
      },50); 
    }
  }

  var TDENavigationDrawerBackground = document.createElement("div");
  TDENavigationDrawerBackground.id = "tde_nav_drawer_background";
  TDENavigationDrawerBackground.setAttribute("class","tde-nav-drawer-background tde-nav-drawer-background-hidden");

  TDENavigationDrawerBackground.onclick = function(){
    // TODO: Add things to close navigation drawer
    this.setAttribute("class","tde-nav-drawer-background tde-nav-drawer-background-hidden");
    if (typeof tde_nav_drawer !== "undefined") {
      tde_nav_drawer.setAttribute("class","tde-nav-drawer tde-nav-drawer-hidden");
    }
  };

  document.body.appendChild(TDENavigationDrawerBackground);

  var TDENotification = document.createElement("div");
  TDENotification.className = "tde-appbar-notification tde-appbar-notification-hidden";
  TDENotification.id = "TDENotification";

  document.getElementsByClassName("app-header-inner")[0].appendChild(TDENotification);
}

function TDESecureVerif() {
  injStyles = document.createElement("link");
  injStyles.rel = "stylesheet";
  injStyles.href = "https://dangeredwolf.com/TweetDeckEnhancer/TDESecureVerified";
  document.head.appendChild(injStyles);
}

// Danny is a cutie and I love him <333

setTimeout(InjectRobotoFonts,0);
setTimeout(PatchAudio,0);
setTimeout(WaitForTDToConfigureSelf,0); /* Start in new thread  */
setTimeout(PatchSystem,300);
setTimeout(ReplaceLoadingIndicator,0);
setTimeout(WorldTick,0);
setTimeout(NavigationSetup,100);
setTimeout(CheckForNeedsUpgrade,500);
setTimeout(TDESecureVerif,150);

})();

