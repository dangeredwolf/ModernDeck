/*
	Boot/Items/FadeOut.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/*
	Controls certain things after they're added to the DOM
	Example: Dismissing dropdown menus, sentry error notification
*/

import { mutationObserver } from "../../Utils";

function onElementAddedToDOM(e?: { target?: Node; }) {
	let tar = $(e.target);

	if (tar.hasClass("dropdown")) {
		// @ts-ignore
		e.target.parentNode.removeChild = (dropdown) => {
			$(dropdown).addClass("mtd-fade-out");
			setTimeout(() => {
				// @ts-ignore
				dropdown.remove();
			},200);
		}
	} else if (tar.hasClass("overlay")) {
		if (!tar.hasClass("is-hidden")) {
			let observer = mutationObserver(e.target, () => {
				if (tar.hasClass("is-hidden")) {
					tar.addClass("mtd-fade-out");
					setTimeout(() => {
						tar.remove();
						observer.disconnect();
					},300);
				}
			},{ attributes: true, childList: false, characterData: false });
		}
	}
}

/*
	Overrides removeChild functions of modals, tooltips, and dropdown menus to have a fade out effect
*/

export function overrideFadeOut() {

	// here we add event listeners to add a fading out animation when a modal dialog is closed
	
    // @ts-ignore
    document.querySelectorAll(".js-modals-container")[0].removeChild = (rmnode: Node) => {
		$(rmnode).addClass("mtd-fade-out");
		setTimeout(() => {
            // @ts-ignore
			rmnode.remove();
		},200);
	};

	// let's make sure we get any that might have initialised before mtdInit began

	$(document.querySelector(".application").childNodes).each((obj: number) => {
        // @ts-ignore
		document.querySelector(".application").childNodes[obj].removeChild = (rmnode: HTMLElement): void => {
			$(rmnode).addClass("mtd-fade-out");
			setTimeout(() => {
				rmnode.remove();
			},200);
		};
	})

	$(".js-modal").on("removeChild", (rmnode) => {
		$(rmnode).addClass("mtd-fade-out");
		setTimeout(() => {
           // @ts-ignore
			rmnode.remove();
		},200);
	});

	// body's removeChild function is overriden to give tooltips their fade out animation

	// body[0].removeChild = (i) => {
	// 	if ($(i).hasClass("tooltip")) {
	// 		setTimeout(() => {
	// 			i.remove(); // Tooltips automagically animate themselves out. But here we clean them up as well ourselves.
	// 		},300);
	// 	} else {
	// 		i.remove();
	// 	}
	// };
	setTimeout(() => {
		if (typeof ($(".app-navigator")[0]) !== "undefined") {
            // @ts-ignore
			$(".app-navigator")[0].removeChild = (i) => {
				if ($(i).hasClass("dropdown-menu")) {
					$(i).addClass("mtd-fade-out");
					setTimeout(() => {
                        // @ts-ignore
						i.remove(); // Tooltips automagically animate themselves out. But here we clean them up as well ourselves.
					},200);
				} else {
                    // @ts-ignore
					i.remove();
				}
			};
		}
	},1000);

	mutationObserver(window.html[0], onElementAddedToDOM as MutationCallback, {attributes: false, subtree: true, childList: true})

}