/*
	FunctionPatcher.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence
*/

export function FunctionPatcher() {
	if (window.localStorage && typeof require === "undefined") {
		window.localStorage.actuallyClear = window.localStorage.clear;
		window.localStorage.clear = () => {
			console.log("CLEAR");
			window.localStorage.removeItem("accountsLastVerified", undefined);
			window.localStorage.removeItem("guestID", undefined);
			window.localStorage.removeItem("length", undefined);
			window.localStorage.removeItem("twitterAccountID", undefined);
			window.localStorage.removeItem("typeaheadTopicsHash", undefined);
			window.localStorage.removeItem("typeaheadTopicsLastPrefetch", undefined);
			window.localStorage.removeItem("typeaheadUserHash", undefined);
			window.localStorage.removeItem("typeaheadUserLastPrefetch", undefined);
		}
	}
	if (window.TD && window.TD.util) {
		window.TD.util.isWrapperApp = () => true;
		window.deck = {
			osname:() => {
				if (navigator.appVersion.indexOf("Win") > -1) {
					return "windows";
				} else if (navigator.appVersion.indexOf("Mac") > -1) {
					return "osx";
				}
				return "linux";
			},
			getWrapperVersion:() => window.version,
			inApp:() => true,
			tearDown:() => {},
			doGrowl:(title, text, icon, tweet, column)=>{
				console.warn("doGrowl: ", title, text, icon, tweet, column);
				let col = TD.controller.columnManager.get(column);
				let tweetObj;



				let notif = new Notification(title,{body:text,icon:icon,silent:true});
				notif.onclick = () => {
					col.updateArray.forEach(privateTweetObj => {
						if (privateTweetObj.id === tweet) {
							tweetObj = privateTweetObj;
						}
					})
					TD.ui.updates.showDetailView(col, tweetObj);
				}
			},
			setTheme:(str) => {console.log("Theme: "+str)},
			authenticateOn:() => {console.warn("authenticateOn");return {hide:()=>{},deleteLater:()=>{}}},
			closeLoadingScreen:()=>{console.warn("closeLoadingScreen")}
		}
	} else {
		setTimeout(FunctionPatcher, 10);
	}
}
