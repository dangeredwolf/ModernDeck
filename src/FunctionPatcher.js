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
			doGrowl:()=>{console.warn("doGrowl: ",arguments)},
			setTheme:(str) => {console.log("Theme: "+str)},
			authenticateOn:() => {console.warn("authenticateOn");return {hide:()=>{},deleteLater:()=>{}}},
			closeLoadingScreen:()=>{console.warn("closeLoadingScreen")}
		}
	} else {
		setTimeout(FunctionPatcher, 10);
	}
}
