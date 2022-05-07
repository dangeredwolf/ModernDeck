/*
	Boot/Items/LateBootScreen.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

export const initLateBootScreen = () => {
    if (typeof require === "undefined" && typeof document.getElementsByClassName("js-signin-ui block")[0] !== "undefined" && !window.html.hasClass("mtd-disable-css")) {
		document.getElementsByClassName("js-signin-ui block")[0].innerHTML =
		`<img class="mtd-loading-logo" src="${window.mtdBaseURL + "assets/img/moderndeck.svg"}" style="display: none;">
		<div class="preloader-wrapper big active">
			<div class="spinner-layer">
				<div class="circle-clipper left">
					<div class="circle"></div>
				</div>
				<div class="gap-patch">
					<div class="circle"></div>
				</div>
				<div class="circle-clipper right">
					<div class="circle"></div>
				</div>
			</div>
		</div>`;

		if (document.getElementsByClassName("spinner-centered")[0]) {
			document.getElementsByClassName("spinner-centered")[0].remove();
		}

		document.getElementsByTagName("html")[0].setAttribute("style", "background: #111");
		document.getElementsByTagName("body")[0].setAttribute("style", "background: #111");

		if (typeof window.mtdLoadStyleCSS === "undefined") {
			const mtdLoadStyleCSS = `
				img.spinner-centered {
					display:none!important
				}
			`
			const mtdLoadStyle = document.createElement("style");
			mtdLoadStyle.appendChild(document.createTextNode(mtdLoadStyleCSS))
			document.head.appendChild(mtdLoadStyle);
		}
		
	}
}