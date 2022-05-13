/*
	FontHandler.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils";

interface FontConfig {
	family?: string;
	style?: string;
	weight?: string;
	name: string;
	extension?: string;
	format?: string;
	range?: string;
}

function fontParseHelper(fontObject: FontConfig): string {
	if (typeof fontObject !== "object" || fontObject === null)
		throw "you forgot to pass the object";

	return `@font-face{font-family:'${(fontObject.family || "Roboto")}';` +
			`font-style:${fontObject.style || "normal"};` +
			`font-weight:${fontObject.weight || "400"};` +
			`src:url(${window.mtdBaseURL}assets/fonts/${fontObject.name}.${fontObject.extension || "woff2"})` +
			`format('${fontObject.format || "woff2"}');` +
			`unicode-range:${fontObject.range||"U+0000-FFFF"}}\n`;
}

/*
	Here, we inject our fonts

	ModernDeck uses Roboto as its general font for Latin (and Cyrillic?) scripts
	Noto Sans is used for whatever scripts Roboto doesn't cover

	font family Material are material design icons
	font family MD is short for ModernDeck. It contains ModernDeck supplemental icons
*/

export function injectFonts() {
	if (window.injectedFonts) {
		return;
	}
	window.injectedFonts = true;

	$(document.head).append(make("style").html(
		fontParseHelper({family:"MD",name:"Icon/ModernDeckVectors"}) +
		fontParseHelper({family:"Material",name:"Icon/MaterialIcons"}) +
		fontParseHelper({family:"MaterialSymbols",name:"Icon/MaterialSymbols"}) +
		/* Roboto Family */
		fontParseHelper({family:"Roboto",name:"Roboto/400-cyrillicext",range:"U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"}) +
		fontParseHelper({family:"Roboto",name:"Roboto/400-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"Roboto",name:"Roboto/400-greekext",range:"U+1F00-1FFF"}) +
		fontParseHelper({family:"Roboto",name:"Roboto/400-greek",range:"U+0370-03FF"}) +
		fontParseHelper({family:"Roboto",name:"Roboto/400-viet",range:"U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB"}) +
		fontParseHelper({family:"Roboto",name:"Roboto/400-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"Roboto",name:"Roboto/400-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +
		fontParseHelper({family:"Roboto",weight:"500",name:"Roboto/500-cyrillicext",range:"U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"}) +
		fontParseHelper({family:"Roboto",weight:"500",name:"Roboto/500-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"Roboto",weight:"500",name:"Roboto/500-greekext",range:"U+1F00-1FFF"}) +
		fontParseHelper({family:"Roboto",weight:"500",name:"Roboto/500-greek",range:"U+0370-03FF"}) +
		fontParseHelper({family:"Roboto",weight:"500",name:"Roboto/500-viet",range:"U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB"}) +
		fontParseHelper({family:"Roboto",weight:"500",name:"Roboto/500-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"Roboto",weight:"500",name:"Roboto/500-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +

		/* Roboto Slab Family */
		fontParseHelper({family:"RobotoSlab",name:"RobotoSlab/400-cyrillicext",range:"U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"}) +
		fontParseHelper({family:"RobotoSlab",name:"RobotoSlab/400-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"RobotoSlab",name:"RobotoSlab/400-greekext",range:"U+1F00-1FFF"}) +
		fontParseHelper({family:"RobotoSlab",name:"RobotoSlab/400-greek",range:"U+0370-03FF"}) +
		fontParseHelper({family:"RobotoSlab",name:"RobotoSlab/400-viet",range:"U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB"}) +
		fontParseHelper({family:"RobotoSlab",name:"RobotoSlab/400-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"RobotoSlab",name:"RobotoSlab/400-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +
		fontParseHelper({family:"RobotoSlab",weight:"500",name:"RobotoSlab/500-cyrillicext",range:"U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"}) +
		fontParseHelper({family:"RobotoSlab",weight:"500",name:"RobotoSlab/500-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"RobotoSlab",weight:"500",name:"RobotoSlab/500-greekext",range:"U+1F00-1FFF"}) +
		fontParseHelper({family:"RobotoSlab",weight:"500",name:"RobotoSlab/500-greek",range:"U+0370-03FF"}) +
		fontParseHelper({family:"RobotoSlab",weight:"500",name:"RobotoSlab/500-viet",range:"U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB"}) +
		fontParseHelper({family:"RobotoSlab",weight:"500",name:"RobotoSlab/500-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"RobotoSlab",weight:"500",name:"RobotoSlab/500-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +

		/* Roboto Mono Family */
		fontParseHelper({family:"RobotoMono",name:"RobotoMono/400-cyrillicext",range:"U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono/400-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono/400-greekext",range:"U+1F00-1FFF"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono/400-greek",range:"U+0370-03FF"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono/400-viet",range:"U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono/400-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono/400-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono/500-cyrillicext",range:"U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono/500-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono/500-greekext",range:"U+1F00-1FFF"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono/500-greek",range:"U+0370-03FF"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono/500-viet",range:"U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono/500-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono/500-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +

		/* Roboto Condensed Family */
		fontParseHelper({family:"RobotoCondensed",name:"RobotoCondensed/400-cyrillicext",range:"U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"}) +
		fontParseHelper({family:"RobotoCondensed",name:"RobotoCondensed/400-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"RobotoCondensed",name:"RobotoCondensed/400-greekext",range:"U+1F00-1FFF"}) +
		fontParseHelper({family:"RobotoCondensed",name:"RobotoCondensed/400-greek",range:"U+0370-03FF"}) +
		fontParseHelper({family:"RobotoCondensed",name:"RobotoCondensed/400-viet",range:"U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB"}) +
		fontParseHelper({family:"RobotoCondensed",name:"RobotoCondensed/400-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"RobotoCondensed",name:"RobotoCondensed/400-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +
		fontParseHelper({family:"RobotoCondensed",weight:"700",name:"RobotoCondensed/700-cyrillicext",range:"U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"}) +
		fontParseHelper({family:"RobotoCondensed",weight:"700",name:"RobotoCondensed/700-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"RobotoCondensed",weight:"700",name:"RobotoCondensed/700-greekext",range:"U+1F00-1FFF"}) +
		fontParseHelper({family:"RobotoCondensed",weight:"700",name:"RobotoCondensed/700-greek",range:"U+0370-03FF"}) +
		fontParseHelper({family:"RobotoCondensed",weight:"700",name:"RobotoCondensed/700-viet",range:"U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB"}) +
		fontParseHelper({family:"RobotoCondensed",weight:"700",name:"RobotoCondensed/700-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"RobotoCondensed",weight:"700",name:"RobotoCondensed/700-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +

		/* Open Sans Family */
		fontParseHelper({family:"OpenSans",name:"OpenSans/400-cyrillicext",range:"U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"}) +
		fontParseHelper({family:"OpenSans",name:"OpenSans/400-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"OpenSans",name:"OpenSans/400-greekext",range:"U+1F00-1FFF"}) +
		fontParseHelper({family:"OpenSans",name:"OpenSans/400-greek",range:"U+0370-03FF"}) +
		fontParseHelper({family:"OpenSans",name:"OpenSans/400-viet",range:"U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB"}) +
		fontParseHelper({family:"OpenSans",name:"OpenSans/400-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"OpenSans",name:"OpenSans/400-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +
		fontParseHelper({family:"OpenSans",weight:"600",name:"OpenSans/600-cyrillicext",range:"U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"}) +
		fontParseHelper({family:"OpenSans",weight:"600",name:"OpenSans/600-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"OpenSans",weight:"600",name:"OpenSans/600-greekext",range:"U+1F00-1FFF"}) +
		fontParseHelper({family:"OpenSans",weight:"600",name:"OpenSans/600-greek",range:"U+0370-03FF"}) +
		fontParseHelper({family:"OpenSans",weight:"600",name:"OpenSans/600-viet",range:"U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB"}) +
		fontParseHelper({family:"OpenSans",weight:"600",name:"OpenSans/600-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"OpenSans",weight:"600",name:"OpenSans/600-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +

		/* Jost Family */
		fontParseHelper({family:"Jost",name:"Jost/400-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"Jost",name:"Jost/400-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"Jost",name:"Jost/400-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +
		fontParseHelper({family:"Jost",weight:"600",name:"Jost/600-cyrillic",range:"U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116"}) +
		fontParseHelper({family:"Jost",weight:"600",name:"Jost/600-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"Jost",weight:"600",name:"Jost/600-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +

		/* Lato Family */
		fontParseHelper({family:"Lato",name:"Lato/400-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"Lato",name:"Lato/400-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +
		fontParseHelper({family:"Lato",weight:"700",name:"Lato/700-latinext",range:"U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF"}) +
		fontParseHelper({family:"Lato",weight:"700",name:"Lato/700-latin",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +

		/* Noto Sans / Noto Sans CJK Family */
		fontParseHelper({family:"Noto Sans CJK",weight:"500",name:"NotoSans/NotoSansCJKjp-Medium",format:"opentype",extension:"otf"}) +
		fontParseHelper({family:"Noto Sans CJK",name:"NotoSans/NotoSansCJKjp-Regular",format:"opentype",extension:"otf"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansHI-Medium",range:"U+0900-097F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansHI-Regular",range:"U+0900-097F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansArabic-Medium",
			range:"U+0600-06FF,U+0750-077F,U+08A0-08FF,U+FB50-FDFF,U+FE70-FEFF,U+10E60-10E7F,U+1EE00-1EEFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansArabic-Regular",
			range:"U+0600-06FF,U+0750-077F,U+08A0-08FF,U+FB50-FDFF,U+FE70-FEFF,U+10E60-10E7F,U+1EE00-1EEFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansArmenian-Medium",range:"U+0530-0580"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansArmenian-Regular",range:"U+0530-0580"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansBengali-Medium",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansBengali-Regular",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansBengali-Medium",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansBengali-Regular",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansBrahmi",range:"U+11000-1107F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansBuginese",range:"U+1A00-1A1B,U+1A1E-1A1F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansBuhid-Regular",range:"U+1740-1753"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansCanadianAboriginal",range:"U+1400-167F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansCarian-Regular",range:"U+102A0-102DF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansChakma-Regular",range:"U+11100-1114F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansCherokee-Regular",range:"U+11100-1114F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansCherokee-Medium",
			range:"U+13A0-13F4,U+13F5,U+13F8-13FD"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansCherokee-Regular",
			range:"U+13A0-13F4,U+13F5,U+13F8-13FD"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansEthiopic-Medium",range:"U+1200-137F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansEthiopic-Regular",range:"U+1200-137F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansGeorgian-Medium",
			range:"U+10A0-10FF,U+2D00-2D2F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansGeorgian-Regular",
			range:"U+10A0-10FF,U+2D00-2D2F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansGujaratiUI-Bold",range:"U+0A80-0AFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansGujaratiUI",range:"U+0A80-0AFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansHebrew-Bold",range:"U+0590-05FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansHebrew-Regular",range:"U+0590-05FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansJavanese",range:"U+A980-A9DF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansKannadaUI-Bold",range:"U+0C80-0CFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansKannadaUI",range:"U+0C80-0CFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansKayahLi-Regular",range:"U+A900-A92F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansKhmerUI-Medium",range:"U+1780-17FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansKhmerUI-Regular",range:"U+1780-17FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansLaoUI-Medium",range:"U+0E80-0EFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansLaoUI-Regular",range:"U+0E80-0EFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansLisu-Regular",range:"U+A4D0-A4FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansMalayalamUI-Bold",range:"U+0D00-0D7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansMalayalamUI",range:"U+0D00-0D7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansMyanmarUI-Bold",range:"U+1000-109F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansMyanmarUI-Regular",range:"U+1000-109F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansOriyaUI-Medium",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansOriyaUI",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansOriyaUI-Bold",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansOsage-Regular",range:"U+104B0-104FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansOsmanya-Regular",range:"U+10480-104AF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansPhagsPa",range:"U+A840-A87F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansNewTaiLue-Regular",range:"U+1980-19DF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansNKo-Regular",range:"U+07C0-07FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansOlChiki-Regular",range:"U+1C50-1C7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansRunic-Regular",range:"U+16A0-16FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansShavian-Regular",range:"U+16A0-16FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansSinhalaUI-Regular",range:"U+0D80-0DFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansSinhalaUI-Medium",range:"U+0D80-0DFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansSundanese",range:"U+1B80-1BBF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansSyriacEastern",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansSyriacWestern",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansSyriacEstrangela",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansTagalog",range:"U+1700-171F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansTagbanwa",range:"U+1760-177F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansTaiLe",range:"U+1950-197F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansTaiTham",range:"U+1A20-1AAF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansTaiViet",range:"U+AA80-AADF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansTamilUI-Regular",range:"U+0B80-0BFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansTamilUI-Medium",range:"U+0B80-0BFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansTeluguUI",range:"U+0C00-0C7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansTeluguUI-Bold",range:"U+0C00-0C7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansThaana",range:"U+0780-07BF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansThaana-Bold",range:"U+0780-07BF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansThaiUI-Regular",range:"U+0E00-0E7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansThaiUI-Medium",range:"U+0E00-0E7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSans/NotoSansTibetan",range:"U+0F00-0FFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansTibetan-Bold",range:"U+0F00-0FFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansTifinagh-Regular",range:"U+2D30-2D7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansVai-Regular",range:"U+A500-A63F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSans/NotoSansYi-Regular",range:"U+A000-A48F"}) +

		// Inter
		fontParseHelper({family:"Inter",name:"Inter/Inter-Regular",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +
		fontParseHelper({family:"Inter",weight:"500",name:"Inter/Inter-Medium",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +
		fontParseHelper({family:"Inter",weight:"600",name:"Inter/Inter-SemiBold",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}) +
		fontParseHelper({family:"Inter",weight:"700",name:"Inter/Inter-Bold",range:"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"})
	));
}
