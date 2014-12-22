// TDEinject.js
// Copyright (c) 2014 Ryan Dolan (ryandolan123)

console.log("TDEinject loaded");

function WaitForTDToConfigureSelf(){
	if (typeof document.getElementsByClassName("app-signin-form")[0] !== "undefined") {
		document.getElementsByTagName("html")[0].setAttribute("class",document.getElementsByTagName("html")[0].getAttribute("class") + " signin-sheet-now-present");
    WaitForLogin();
	} else {
		if (typeof document.getElementsByClassName("app-content")[0] === "undefined") {
			setTimeout(WaitForTDToConfigureSelf,60);
		} else {
			PreventExpandedColumns();
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

function PreventExpandedColumns(){

	if (typeof document.getElementsByClassName("js-app application")[0] !== "undefined") {
		if (!document.getElementsByClassName("js-app application")[0].getAttribute("class").contains("is-condensed")) {
			document.getElementsByClassName("js-app application")[0].setAttribute("class","js-app application is-condensed");
		}
	}

	if (typeof document.getElementsByClassName("js-app-header")[0] !== "undefined") {
		if (!document.getElementsByClassName("js-app-header")[0].getAttribute("class").contains("is-condensed")) {
			document.getElementsByClassName("js-app-header")[0].setAttribute("class",document.getElementsByClassName("js-app-header")[0].getAttribute("class") + " is-condensed");
		}
	}
	

	setTimeout(PreventExpandedColumns,1500);
}


function PatchSystem() {
  console.log("Waiting for system to be ready for patching...");
  if (typeof TD === "undefined") {
    setTimeout(PatchSystem,50);
    return;
  }
  console.log("Waiting for system to be ready for patching... 2");
  if (typeof TD.storage === "undefined") {
    setTimeout(PatchSystem,50);
    return;
  }
  console.log("Waiting for system to be ready for patching... 3");
  if (typeof TD.storage.store === "undefined") {
    setTimeout(PatchSystem,50);
    return;
  }
  console.log("Waiting for system to be ready for patching... 4");
  if (typeof TD.storage.store.getCurrentAuthType === "undefined") {
    setTimeout(PatchSystem,50);
    return;
  }

  console.log("Executing AuthType patch...");

  TD.storage.store.getCurrentAuthType = function() {
    return "twitter";
  }

  return;
}

WaitForTDToConfigureSelf();
PreventExpandedColumns();

setTimeout(PatchSystem,1500); // Delayed so the user is not prompted by TweetDeck if using a TweetDeck Account
