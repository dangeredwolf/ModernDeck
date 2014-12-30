// TDEinject.js
// Copyright (c) 2014 Ryan Dolan (ryandolan123)

console.log("TDEinject loaded");

// var tmpGetId = document.getElementById // In case of emergency, break double slash and patch WaitForText()

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
}


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

  console.log("Executing AuthType patch...");

  TD.storage.store.getCurrentAuthType = function() {
    return "twitter";
  }

  console.log("done patching AuthType...");

  WaitForText();
  return;
}

function WaitForText() {
  console.log("Waiting for login...");
	if (typeof TD.storage.store._backend === "undefined") {
    	setTimeout(WaitForText,50);
    	return;
  }

  if (typeof TD.storage.store._backend.tweetdeckAccount === "undefined") {
    setTimeout(WaitForText,50);
  	return;
  }

  if (typeof text === "undefined") {
    setTimeout(WaitForText,50);
  	return;
  }

  if (typeof document.getElementById("open-modal") === "undefined") {
    setTimeout(WaitForText,50);
    return;
  }

  console.log("ready!");

  /*if (typeof window.alert_ !== "undefined") {
    console.log("can u not"); // coolstar can u not
    window.alert = window.alert_;
  }*/


  if (TD.storage.store._backend.tweetdeckAccount.indexOf("coolstar") > -1 || TD.storage.store._backend.tweetdeckAccount.indexOf("379029313") > -1) { // 245543252 // 379029313
  	document.getElementById("open-modal").setAttribute("style","display: block;");
    document.getElementById("open-modal").innerHTML = '<div class="mdl">    <header class="js-mdl-header mdl-header"> <h3 class="mdl-header-title js-header-title">Hey coolstar</h3>   </header> <div class="mdl-inner"> <div class="mdl-content js-mdl-content horizontal-flow-container">   <dl class="mdl-column padding-t--8 padding-l--8"> <dt><b class="txt weight-light make-text-big">Follow me @ryandolan123 :)<br></b><button class="btn" id="maybeanothertime">Maybe another time...</button></dt>             </dl>     </div> </div>  </div>';
    if (typeof maybeanothertime !== "undefined") { // Tamper with it and there's no way out
      var tdemot = maybeanothertime;
      tdemot.setAttribute("id","");
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
}

WaitForTDToConfigureSelf();
WorldTick();

setTimeout(PatchSystem,1500); // Delayed so the user is not prompted by TweetDeck if using a TweetDeck Account
