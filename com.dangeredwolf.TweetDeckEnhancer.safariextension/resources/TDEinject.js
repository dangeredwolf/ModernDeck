// TDEinject.js
// Copyright (c) 2015 Dangered Wolf

// made with love <3

// also dedicated to my amazing boyfriend danny <333

//(function() {

var msgID = 0;
var messagesAccounted = [];

var ShouldUpgrade = false;

var addedColumnsLoadingTagAndIsWaiting = false;
var TDEBaseURL = "https://dangeredwolf.com/assets/tdetest/";
var progress = null;
var tde_fetch_profile_info_for_nav_drawer = 0;

var SystemVersion = "5.0.5";

var TreatGeckoWithCare = false;

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
  console.log("TDEURLExchange failed :( defaulting to streamed sources, may not work... but we'll try...");
}

if (typeof chrome === "undefined" && typeof safari === "undefined") {
  TreatGeckoWithCare = true;
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

function CryptoScript() {
  var injectsha3 = document.createElement("script");
  injectsha3.type = "text/javascript";
  injectsha3.src = TDEBaseURL + "resources/sha3.js";
  document.body.appendChild(injectsha3);
}

function GetPreferencesIdentifierFromCrypto() {
  if (typeof CryptoJS !== "undefined") {
    return CryptoJS.SHA3(TD.storage.store._backend.guestID); // 512 bit SHA-3? yes please
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
  angularstyles.href = TDEBaseURL + "resources/angular/angular-material.min.css";
  angularstyles.id = "angularstyles";
  document.head.appendChild(angularstyles);

  // AngularJS / AngularJS Material Scripts

  var AngularScripts =[
    {src: TDEBaseURL + "resources/angular/hammer.min.js", id: "injectAngularJS"},
    {src: TDEBaseURL + "resources/angular/angular.min.js", id: "injectAngularJS2"},
    {src: TDEBaseURL + "resources/angular/angular-animate.min.js", id: "injectAngularJS3"},
    {src: TDEBaseURL + "resources/angular/angular-aria.min.js", id: "injectAngularJS4"},
    {src: TDEBaseURL + "resources/angular/angular-material.min.js", id: "injectAngularJS5"}
  ];

  var temp;

  for (var i = 0; i < AngularScripts.length; i++) {
    temp = document.createElement("script");
    temp.type = "text/javascript";
    temp.src = AngularScripts[i]['src'];
    temp.id = AngularScripts[i]['id'];
    document.body.appendChild(temp);
  }

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
    document.getElementsByTagName("html")[0].setAttribute("class",document.getElementsByTagName("html")[0].getAttribute("class").replace(" tde-columns-loading",""));
  },800);

  return;
}

function Upgrade() {
  progressind.innerHTML = "Just a sec...";
  setTimeout(PostRegistration,300);
}

function DisplayMigrateUI1() {
  StreamAngularJS();
  document.getElementsByTagName("html")[0].className += " tde-is-upgrading ";
  setTimeout(DisplayMigrateUI2,1500);
}

function DisplayMigrateUI2() {
  document.getElementsByClassName("js-app-loading")[0].innerHTML = '<div class="mdl s-fluid tde-upgrading"><div class="mdl-header"></div><div class="mdl-inner"><div class="mdl-content"><md-progress-circular md-mode="indeterminate" aria-valuemin="0" aria-valuemax="100" role="progressbar" class="md-default-theme" style="-webkit-transform: scale(1);"><div class="md-spinner-wrapper"><div class="md-inner"><div class="md-gap"></div><div class="md-left"><div class="md-half-circle"></div></div><div class="md-right"><div class="md-half-circle"></div></div></div></div></md-progress-circular><h2>Enhancer is Upgrading...</h2><h3>Getting things ready</h3><div class="whatever"></div></div></div></div>';
  progressind = $(".tde-upgrading .mdl-content h3")[0];
  setTimeout(Upgrade,1000);
}

function CheckForNeedsUpgrade() {
  if (typeof CryptoJS === "undefined") {
    setTimeout(CheckForNeedsUpgrade,200);
    return;
  }
  if (typeof TD === "undefined") {
    setTimeout(CheckForNeedsUpgrade,200);
    return;
  }
  if (typeof TD.storage === "undefined") {
    setTimeout(CheckForNeedsUpgrade,200);
    return;
  }
  if (typeof TD.storage.store === "undefined") {
    setTimeout(CheckForNeedsUpgrade,200);
    return;
  }
  if (typeof TD.storage.store._backend === "undefined") {
    setTimeout(CheckForNeedsUpgrade,200);
    return;
  }
  if (typeof TD.storage.store._backend.guestID === "undefined") {
    setTimeout(CheckForNeedsUpgrade,200);
    return;
  }
  $.ajax( "https://dangeredwolf.com/tdedb/check.php?regname="  + GetPreferencesIdentifierFromCrypto())
  .done(function(meh) {
    if (meh === "No") {
      ShouldUpgrade = true;
      setTimeout(DisplayMigrateUI1,500);
    } else {
      console.log("Welcome back! <3");
    }
  })
  .fail(function() {
    console.log("An error occurred contacting dangeredwolf.com");
  });
}

function PostRegistration() {
  progressind.innerHTML = "Migrating to 512-bit crypto identifier...";
  $.ajax( "https://dangeredwolf.com/tdedb/register.php?regname=" + GetPreferencesIdentifierFromCrypto())
  .done(function(meh) {
    if (meh === "OK") {
      progressind.innerHTML = "Upgrade Complete!";
      setTimeout(function(){
        progressind.innerHTML = "Welcome to Enhancer " + SystemVersion;
      },1000);
      setTimeout(function(){
        progressind.innerHTML = "Restarting TweetDeck";
      },2500);
      setTimeout(function(){
        location.reload();
      },3000);
    } else {
      progressind.innerHTML = "Error: Unknown Response";
      setTimeout(function(){
        location.reload();
      },2500);
    }
  })
  .fail(function() {
    console.log("An error occurred contacting dangeredwolf.com");
  });
}

function EnableFabulousMode() {
  $("html")[0].className += " tde-fabulous-april-fools";
}

function CheckForFabulousness() {
  var pebble = new Date();
  if (pebble.getMonth() === 3 && pebble.getDate() === 1 && pebble.getFullYear() === 2015) {
    console.log("fabulous!!!");
    PromptFabulousness();
  } else {
    console.log("waiting for fabulousness");
    setTimeout(FabulousThread,0);
  }
}

function FabulousThread() {
  var pebble = new Date();
  if (pebble.getMonth() === 3 && pebble.getDate() === 1 && pebble.getFullYear() === 2015) {
    console.log("fabulous!!!");
    PromptFabulousness();
    return;
  }
  setTimeout(FabulousThread,30000);
}

function PromptFabulousness() {
  if (typeof $ === "undefined") {
    setTimeout(PromptFabulousness,200);
    return;
  }

  if (typeof $("#open-modal")[0] === "undefined") {
    setTimeout(PromptFabulousness,200);
    return;
  }

  $("#open-modal")[0].innerHTML = '<div class="js-modal-panel mdl s-tall-fixed is-inverted-dark"> <header class="js-mdl-header mdl-header"> <h3 class="mdl-header-title js-header-title">TweetDeck Enhancer</h3> <a href="#" class="mdl-drag-handle js-drag-handle"><i class="sprite sprite-drag"></i></a> <a href="#" class="mdl-dismiss js-dismiss link-normal-dark"><i class="icon icon-close"></i></a> </header> <div class="mdl-inner"> <div class="mdl-content js-mdl-content horizontal-flow-container"><h1 style="text-align:center;padding-top:30px;font-weight:300;font-size:34px">TweetDeck Enhancer - Fabulous Mode</h1><p style="font-size:16px; text-align:center; padding:10px;word-wrap:normal;height:30%;line-height:30px;">In TweetDeck Enhancer, we want to make the user experience as good as we possibly<br>can. A new way we are doing this is with the all new TweetDeck Enhancer Fabulous Mode.<br>Fabulous Mode is a brand new feature which makes your TweetDeck client more<br>fabulous than ever! You are invited to be one of the first to try it!<br><br> What are you waiting for? Enable TweetDeck Enhancer Fabulous Mode!</p><img src="https://dangeredwolf.com/assets/TDE5/aprilfools/fabuloustde500.png" style="height:250px;width: 250px;margin-left:auto;margin-right:auto;position:relative;padding-left:200px;"><div class="pull-right" style="padding-top:275px;padding-right:15px"><button class="btn" onclick="javascript:$(\'#open-modal\')[0].setAttribute(\'style\',\'display: none;\');">Not yet :(</button><button class="btn" onclick="javascript:EnableFabulousMode();$(\'#open-modal\')[0].setAttribute(\'style\',\'display: none;\');">I\'m in!</button></div></div></div></div>';
  $("#open-modal")[0].setAttribute("style","display: block;");
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

function Analytics() {
  if (typeof $ === "undefined") {
    setTimeout(Analytics,500);
    return;
  }
  if (typeof $.ajax === "undefined") {
    setTimeout(Analytics,500);
    return;
  }
  $.ajax({url:"https://dangeredwolf.com/analytics/TDE5?crypto=sha3&v=" + SystemVersion + "&release=stable"});
}

function ImJustKidding(){
  console.log("activate super easter egg powers");
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

function MouseConfig() {
  if (typeof $ === "undefined") {
    setTimeout(MouseConfig,200);
    return;
  }

  if (TreatGeckoWithCare) {
    $(".js-app-header")[0].className = "js-app-header pin-all app-header is-condensed tde-show-column-icons";
    return;
  }

  if (typeof $(".js-app-header")[0] === "undefined") {
    setTimeout(MouseConfig,200);
    return;
  } else {
    if (typeof $(".js-app-header").mouseover === "undefined") {
      console.log("still waiting...")
      setTimeout(MouseConfig,200);
      return;
    }
    $(".js-app-header").mouseover(function() {
      $(".js-app-header")[0].className = "js-app-header pin-all app-header is-condensed tde-show-column-icons";
    });

    $(".js-app-header").mouseleave(function(){
      console.log("dismiss 1");
      setTimeout(function(){
        console.log("dismiss 2");
        if ($(".js-app-header").is(":not(:hover)")) {
          console.log("dismiss 2.1");
          setTimeout(function(){
            if ($(".js-app-header").is(":not(:hover)")) {
              console.log("dismiss 3");
              setTimeout(function(){
                if ($(".js-app-header").is(":not(:hover)")) {
                  console.log("dismiss 4");
                  setTimeout(function(){
                    if ($(".js-app-header").is(":not(:hover)")) {
                      console.log("dismiss 5");
                      $(".js-app-header")[0].className = "js-app-header pin-all app-header is-condensed";
                    }
                  },400);
                }
              },300);
            }
          },200);
        }
      },100);
    });
  }
}

// screw gender roles

function PrepareLoginStuffs() {
  if (typeof $ === "undefined") {
    console.log("Waiting for jQuery for login stuffs... [new edition of function]");
    setTimeout(PrepareLoginStuffs,200);
    return;
  }

  var FindProfButton = $(".js-account-settings-accounts .account-settings-row:first-child .js-account-settings-detail.accordion-panel .padding-tm.padding-hxl .link-complex.txt-medium.block.cf[rel=\"user\"]")[0];
  if (typeof FindProfButton === "undefined") {
    console.log("Waiting for login stuffs... [new edition of function]");
    setTimeout(PrepareLoginStuffs,200);
    return;
  }
  FindProfButton.click();
  setTimeout(FinaliseLoginStuffs,0);

  setTimeout(function(){
    if (typeof $(".js-click-trap")[0] !== "undefined") {
      $(".js-click-trap")[0].className += " is-hidden";
    }
  },50);
  if (typeof $(".js-click-trap")[0] !== "undefined") {
    $(".js-click-trap")[0].className += " is-hidden";
  }
}

function FinaliseLoginStuffs() {
  console.log('waiting for final login stuffs [revised]');

  if (typeof $(".js-click-trap")[0] !== "undefined") {
    $(".js-click-trap")[0].className += " is-hidden";
  }

  if (typeof document.getElementsByClassName("prf-header")[0] === "undefined") {
    if (typeof tde_fetch_profile_info_for_nav_drawer === "undefined") {
      tde_fetch_profile_info_for_nav_drawer = 0;
    }
    tde_fetch_profile_info_for_nav_drawer++;

    if (tde_fetch_profile_info_for_nav_drawer > 10) {
      console.log("this is not even working, bye");
      setTimeout(PrepareLoginStuffs,0);
      return;
    }
    setTimeout(LoginStuffs3,150);
    return;
  }

  tde_nd_header_image.setAttribute("style",$(".prf-header")[0].style.cssText); // Fetch header and place in nav drawer
  tde_nd_header_photo.setAttribute("src",$(".prf-img")[0].childNodes[1].src); // Fetch profile picture and place in nav drawer
  tde_nd_header_username.innerHTML = $(".prf-card-inner")[0].childNodes[1].childNodes[5].childNodes[0].textContent; // Fetch twitter handle and place in nav drawer

  console.log("Finished login stuffs! you are in the nav drawer, I think!");

  Analytics(); // Collect basic TDE version analytics data (doesn't log usage, account name / ID, or anything else)
}

function NavigationSetup() {
  if (typeof document.getElementsByClassName("app-header-inner")[0] === "undefined") {
    setTimeout(NavigationSetup,100);
    return;
  }

  var TDENavigationDrawerButton = document.createElement("a");
  TDENavigationDrawerButton.id = "tde-navigation-drawer-button";
  TDENavigationDrawerButton.setAttribute("class","js-header-action tde-drawer-button link-clean cf app-nav-link");
  TDENavigationDrawerButton.innerHTML = '<div class="obj-left"> <img src="https://dangeredwolf.com/assets/TDE5/navbutton.png" class="tde-nav-activator"> </div> <div class="nbfc padding-ts hide-condensed"></div>';

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
  TDENavigationDrawer.innerHTML = '<img id="tde_nd_header_image" class="tde-nd-header-image"><img class="avatar size73 tde-nd-header-photo" id="tde_nd_header_photo"><div class="tde-nd-header-username" id="tde_nd_header_username"></div><button class="btn tde-nav-button tde-settings-button" id="tdset"><img src="https://dangeredwolf.com/assets/TDE5/tweetdecksmall.png" class="tde-nav-drawer-icon">TweetDeck Settings</button><button class="btn tde-nav-button" id="tdesettings"><img src="https://dangeredwolf.com/assets/TDE5/TDEsmall.png" class="tde-nav-drawer-icon">Enhancer Settings</button><button class="btn tde-nav-button" id="btdsettings"><img src="https://dangeredwolf.com/assets/TDE5/BTDsmall.png" class="tde-nav-drawer-icon">Better TweetDeck Settings</button><div class="tde-nav-divider"></div><button id="tde_signout" class="btn tde-nav-button"><img src="https://dangeredwolf.com/assets/TDE5/logout.png" class="tde-nav-drawer-icon">Sign Out</button><button id="tdaccsbutton" class="btn tde-nav-button"><img src="https://dangeredwolf.com/assets/TDE5/accounts.png" class="tde-nav-drawer-icon">Your Accounts</button><div class="tde-nav-divider"></div><button id="kbshortcuts" class="btn tde-nav-button"><img src="https://dangeredwolf.com/assets/TDE5/KBshortcuts.png" class="tde-nav-drawer-icon">Keyboard Shortcuts</button><button id="addcolumn" class="btn tde-nav-button"><img src="https://dangeredwolf.com/assets/TDE5/AddColumn.png" class="tde-nav-drawer-icon">Add Column</button>';

  document.body.appendChild(TDENavigationDrawer);

  if (typeof tde_nd_header_image !== "undefined") {
    tde_nd_header_image.setAttribute("style","background:#00BCD4");
  }

  if (typeof tde_nd_header_photo !== "undefined") {
    tde_nd_header_photo.setAttribute("src","");
  }

  if (typeof tde_nd_header_username !== "undefined") {
    tde_nd_header_username.innerHTML = "An error occurred fetching<br>Please wait or refresh page!!"
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
    setTimeout(function(){
      document.getElementsByClassName("js-app-settings")[0].click();
    },25);
    setTimeout(function(){
      document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes[document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[7].childNodes[1].click();
    },50); 
    setTimeout(function(){
      var tdesettingsmodalview = $("#settings-modal .mdl")[0];
      tdesettingsmodalview.className = "js-modal-panel mdl s-short is-inverted-dark tde-settings-panel";
      var tdesettingsmodalinner = $("#settings-modal .mdl .mdl-inner")[0];
      $("#settings-modal .mdl .js-header-title")[0].className = "mdl-header-title";
      $("#settings-modal .mdl .mdl-header-title")[0].innerHTML = "Enhancer Settings";
      tdesettingsmodalinner.innerHTML = '<div class="mdl-content js-mdl-content horizontal-flow-container"> <div class="l-column mdl-column mdl-column-sml"> <div class="l-column-scrollv scroll-v  scroll-alt "> <ul class="lst-group js-setting-list">  <li class="selected"><a href="#" class="list-link" id="enhancer_settings_about_button" data-action="general"><strong>About</strong></a></li></ul> </div> </div> <div class="l-column mdl-column mdl-column-lrg"> <div class="l-column-scrollv scroll-v  scroll-alt mdl-col-settings"> <form action="#" id="global-settings" accept-charset="utf-8" class="frm"><fieldset id="general_settings"><img src="https://dangeredwolf.com/assets/TDE5/tdeaboutsmaller.png" class="tde-logo"><h1 class="list-placeholder tde-about-title">TweetDeck Enhancer</h1><h2 class="tde-version-title">You\'re running Enhancer ' + SystemVersion + '</h2></fieldset></form> </div> </div> </div>';
      //tdesettingsmodalview.setAttribute("style","display:block;");
      /*tdesettingsmodalview.onclick = function() {
        if (typeof tde_settings_modal_panel !== "undefined") {
          tde_settings_modal_panel.setAttribute("class","js-modal-panel mdl s-short is-inverted-dark tde-modal-window-fade-out");
          tdesettingsmodalview.setAttribute("style","display: none;");
          setTimeout(function(){
            if (typeof tde_settings_modal_panel !== "undefined") {
              tde_settings_modal_panel.remove();
            }
          },600)
        }
      }*/
      window.tdeblah = false;
      $("#enhancer_settings_about_button").on("mousedown",function() {
        console.log("down!!");
        window.tdeblah = true;
        setTimeout(function(){
          if (window.tdeblah === true) {
            console.log("sweet!!!");
            ImJustKidding();
          }
        },2000)
      });
      $("#enhancer_settings_about_button").on("mouseup",function() {
        window.tdeblah = false;
        console.log("up!!");
      });
    },100);
  }

  btdsettings.onclick = function(){
    TDEPrepareWindows();
    setTimeout(function(){
      var opn = window.open("chrome-extension://micblkellenpbfapmcpcfhcoeohhnpob/options/options.html", '_blank');
      opn.focus();
    },200);
  }

  if (TreatGeckoWithCare) {
    btdsettings.remove();
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

function KeyboardShortcutHandler(e) {
  if ($("input:focus,textarea:focus").length > 0) {
  	return;
  }

  if (e.keyCode === 81) {
    if (typeof tde_nav_drawer !== "undefined") {
      if (tde_nav_drawer.className === "tde-nav-drawer tde-nav-drawer-hidden") {
        if (typeof document.getElementById("tde-navigation-drawer-button") !== "undefined") {
          document.getElementById("tde-navigation-drawer-button").click();
        }
      } else {
        if (typeof tde_nav_drawer_background !== "undefined") {
          tde_nav_drawer_background.click();
        }
      }
    }
  }
}

function PreferenceLoader() {
  if (typeof localStorage.tde_colour !== "undefined") {
    // do stuff
  }
  if (typeof localStorage.tde_developer_parameter_debug !== "undefined") {
    if (localStorage.tde_developer_parameter_debug === "true") {
      console.log("tde_developer_parameter_debug = true");
      var TDEAttachDebuggerScope = this;
      TDEAttachDebugger(TDEAttachDebuggerScope);
    } else {
      window.TDEAttachDebugger = undefined;
    }
  } else {
    window.TDEAttachDebugger = undefined;
  }
}

function TDEAttachDebugger(debuggerScope) {
  console.log("Attaching developer debugger");
  window.tde_debug = debuggerScope;
}

function MustachePatcher() {
  if (typeof TD_mustaches === "undefined") {
    setTimeout(MustachePatcher,500);
    return;
  }
  if (typeof TD_mustaches["settings/global_setting_filter_row.mustache"] === "undefined") {
    setTimeout(MustachePatcher,500);
    return;
  }

  TD_mustaches["settings/global_setting_filter_row.mustache"]='<li class="list-filter cf"> {{_i}}<div class="tde-mute-text tde-mute-text-{{getDisplayType}}"></div> {{>text/global_filter_value}}{{/i}} <input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}" class="js-remove-filter small btn btn-negative"> </li>'
}

function TDESupportedParameters() {
  if (typeof $ === "undefined") {
    setTimeout(TDESupportedParameters,500);
    return;
  }
  $("html")[0].className += " tde-preferences-differentiator tde-api-ver-5-0 tde-js-loaded";
}

function YesFavicon() {
  console.log("gonna replace favicon :3");
  if (typeof $ === "undefined") {
    setTimeout(YesFavicon,200);
    return;
  }
  $("link[rel=\"shortcut icon\"]")[0].href = TDEBaseURL + "resources/favicon.ico";
}

// Danny is a cutie and I love himmm <333

setTimeout(CryptoScript,0);
setTimeout(CheckForNeedsUpgrade,0);
setTimeout(InjectRobotoFonts,0);
setTimeout(PatchAudio,0);
setTimeout(WaitForTDToConfigureSelf,0);
setTimeout(PatchSystem,300);
//setTimeout(ReplaceLoadingIndicator,0);
setTimeout(WorldTick,0);
setTimeout(NavigationSetup,100);
setTimeout(TDESecureVerif,150);
setTimeout(MouseConfig,500);
setTimeout(PreferenceLoader,1000);
setTimeout(TDESupportedParameters,500);
setTimeout(MustachePatcher,500);
setTimeout(CheckForFabulousness,500);
setTimeout(YesFavicon,0);

window.addEventListener("keyup", KeyboardShortcutHandler, false);

console.log("TDEinject loaded");

//})();