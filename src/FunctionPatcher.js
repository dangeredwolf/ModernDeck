export function FunctionPatcher() {
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
