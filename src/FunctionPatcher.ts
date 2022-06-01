/*
	FunctionPatcher.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ColumnChirp } from "./Types/TweetDeck";
import { getIpc } from "./Utils";

const pretendToBeWrapperApp = false;

export const FunctionPatcher = (): void => {
	if (window.localStorage && typeof window.require === "undefined") {
		window.localStorage.actuallyClear = window.localStorage.clear;
		window.localStorage.clear = (): void => {
			console.log("CLEAR");
			window.localStorage.removeItem("accountsLastVerified");
			window.localStorage.removeItem("guestID");
			window.localStorage.removeItem("length");
			window.localStorage.removeItem("twitterAccountID");
			window.localStorage.removeItem("typeaheadTopicsHash");
			window.localStorage.removeItem("typeaheadTopicsLastPrefetch");
			window.localStorage.removeItem("typeaheadUserHash");
			window.localStorage.removeItem("typeaheadUserLastPrefetch");
		}
	}
	if (typeof TD?.util !== "undefined" && pretendToBeWrapperApp) {
		TD.util.isWrapperApp = () => true;
		window.deck = {
			osname:() => {
				if (navigator.appVersion.indexOf("Win") > -1) {
					return "windows";
				} else if (navigator.appVersion.indexOf("Mac") > -1) {
					return "osx";
				}
				return "linux";
			},
			getWrapperVersion:() => window.ModernDeck.versionString,
			inApp:() => true,
			tearDown:() => {},
			doGrowl:(title: string, text: string, icon: string, tweet: string, column: string)=>{
				let col = TD.controller.columnManager.get(column);
				let tweetObj: ColumnChirp = null;

				let notif = new Notification(title,{body:text,icon:icon,silent:true});
				notif.onclick = () => {
					col.updateArray.forEach(privateTweetObj => {
						if (privateTweetObj.id === tweet) {
							tweetObj = privateTweetObj;
						}
					})
					TD.ui.updates.showDetailView(col, tweetObj);
					getIpc().send("focus");
				}
			},
			setTheme:(str): void => {console.log("Theme: "+str)},
			authenticateOn:(): any => {console.warn("authenticateOn");return {hide:()=>{},deleteLater:()=>{}}},
			closeLoadingScreen:(): void =>{console.warn("closeLoadingScreen")}
		}
	} else {
		setTimeout(FunctionPatcher, 10);
	}
}
