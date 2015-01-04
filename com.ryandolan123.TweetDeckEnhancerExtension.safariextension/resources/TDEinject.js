// TDEinject.js
// Copyright (c) 2014 Ryan Dolan (ryandolan123)

(function() { // Additional security to prevent other extensions and website code from tampering with TDE (Ahem, @coolstarorg)

var oldlog = console.log;
var oldconsole = console;
var oldsetTimeout = window.setTimeout;
var elementById = document.getElementById; // In case of emergency, break double slash and patch WaitForText()

if (oldlog.toString() !== "function log() { [native code] }") {
  oldlog = function(){}; // INTEGRITY CHECK FAILED, bye bye
}

function log(txt) {
  oldlog.call(oldconsole,txt);
}

if (oldsetTimeout.toString() !== "function setTimeout() { [native code] }") {
  log("setTimeout integrity check failed :(")
  oldsetTimeout = function(exec){}; // INTEGRITY CHECK FAILED, bye bye
}

function setTimeout(func,time) {
  oldsetTimeout.call(this,func,time)
}

if (elementById.toString() !== "function getElementById() { [native code] }") {
  log("elementById integrity check failed :(")
  elementById = function(){return {};}; // INTEGRITY CHECK FAILED, bye :(
}

log("TDEinject loaded");

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

//function WorldTick(){

  // Prevent Expanded Columns

  /*if (typeof document.getElementsByClassName("js-app application")[0] !== "undefined") {
    if (!document.getElementsByClassName("js-app application")[0].getAttribute("class").contains("is-condensed")) {
      document.getElementsByClassName("js-app application")[0].setAttribute("class","js-app application is-condensed");
    }
  }

  if (typeof document.getElementsByClassName("js-app-header")[0] !== "undefined") {
    if (!document.getElementsByClassName("js-app-header")[0].getAttribute("class").contains("is-condensed")) {
      document.getElementsByClassName("js-app-header")[0].setAttribute("class",document.getElementsByClassName("js-app-header")[0].getAttribute("class") + " is-condensed");
    }
  }*/

  // TDE Settings Button

  /*if (document.getElementsByClassName("lst-group js-setting-list").length > 0) {
    if (typeof tdesettings === "undefined") {

      var JSTDESettingsListItem = document.createElement("li");
      JSTDESettingsListItem.setAttribute("class"," ");
      JSTDESettingsListItem.setAttribute("id","tdesettingslistitem");
      JSTDESettingsListItem.innerHTML = '<a href="#" class="list-link" id="tdesettings" data-action="tde"><strong>TweetDeck Enhancer</strong></a>';

      document.getElementsByClassName("lst-group js-setting-list")[0].appendChild(JSTDESettingsListItem);

      if (typeof tdesettings !== "undefined") { // I doubt this will happen in any circumstance, but just in case, we'll make sure its there
        tdesettings.onclick = function() {
          if (typeof document.getElementById("global-settings") !== "undefined") {
            document.getElementById("global-settings").innerHTML =
            '<!-- TDE Settings -->\
            <fieldset id="tde_settings">More to come...</fieldset>';
            
            if (document.getElementsByClassName("l-column-scrollv scroll-v  scroll-alt ").length > 1) { // Okay thats great we brought the view up. Now we need to pretend we're tweetdeck and swap out the classes.
              var ChildNodes = document.getElementsByClassName("l-column-scrollv scroll-v  scroll-alt ")[0].childNodes[1].childNodes;

              for (i = 0; i < ChildNodes.length; i++) { 
                if (typeof ChildNodes[i].setAttribute !== "undefined") { // Make sure it's real, sometimes non-real things are thrown in the mix by tweetdeck / chrome
                  ChildNodes[i].setAttribute("class"," ");
                }
              }

              if (typeof tdesettingslistitem !== "undefined") {
                tdesettingslistitem.setAttribute("class", "selected");
              }
            }
          }
        }
      }
    }
  }


  setTimeout(WorldTick,300);*/
//}


function PatchSystem() {
  if (typeof TD === "undefined") {
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

  log("Executing AuthType patch...");

  TD.storage.store.getCurrentAuthType = function() {
    return "twitter";
  }

  log("done patching AuthType...");

  return;
}

var SecureOpenModal = ""; // i'm so gay
var SecureAlertVerifiedForIntegrity = false;

function SecureAlert() {

  if (!SecureAlertVerifiedForIntegrity) {
    log("SecureAlert is waiting for tweetdeck components...");

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
        log(document.getElementById("open-modal"));
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

    log("ready!");

  }

  /*if (typeof window.alert_ !== "undefined") {
    console.log("can u not"); // coolstar can u not
    window.alert = window.alert_;
  }*/

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

  
  log("done waiting for login");
  log("it's showtime");

  return;
}

function ReplaceLoadingIndicator() {
  if (typeof document.getElementsByClassName("js-startflow-content startflow")[0] === "undefined") {
    setTimeout(ReplaceLoadingIndicator,30);
    return;
  }

  document.getElementsByClassName("js-startflow-content startflow")[0].innerHTML = '<video class="spinner-centered spinner-fade-in" width="74" height="76" src="https://ryandolan123.com/assets/tweetdeck/img/spinner.mov" autoplay loop></video>';
}

// alfonso torres is actually cute

setTimeout(WaitForTDToConfigureSelf,0); /* Start in new thread  */
setTimeout(PatchSystem,1500); // Delayed so the user is not prompted by TweetDeck if using a TweetDeck Account
setTimeout(ReplaceLoadingIndicator,0);

SecureAlert(); // Started after threads are initialized as this function tends to be more dangerous

})();