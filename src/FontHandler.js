import { make } from "./Utils.js";

function fontParseHelper(a) {
	if (typeof a !== "object" || a === null)
		throw "you forgot to pass the object";

	return "@font-face{font-family:'"+(a.family||"Roboto")+"';font-style:"+(a.style||"normal")+";font-weight:"+(a.weight || "400")+";src:url("+mtdBaseURL+"sources/fonts/"+a.name+"."+(a.extension || "woff2")+") format('"+(a.format || "woff2")+"');"+"unicode-range:"+(a.range||"U+0000-FFFF")+"}\n";
}

/*
	Here, we inject our fonts

	ModernDeck uses Roboto as its general font for Latin (and Cyrillic?) scripts
	Noto Sans is used for whatever scripts Roboto doesn't cover

	font family Material is short for Material icons
	font family MD is short for ModernDeck. It contains ModernDeck supplemental icons
*/

export function injectFonts() {
	if (window.injectedFonts) {
		return;
	}
	window.injectedFonts = true;
	
	$(document.head).append(make("style").html(
		fontParseHelper({family:"MD",name:"mdvectors"}) +
		fontParseHelper({family:"Material",name:"MaterialIcons"}) +
		fontParseHelper({name:"Roboto-Regular"}) +
		fontParseHelper({weight:"500",name:"Roboto-Medium"}) +
		fontParseHelper({name:"Roboto-Italic",style:"italic"}) +
		fontParseHelper({weight:"300",name:"Roboto-Light"}) +
		fontParseHelper({weight:"500",name:"Roboto-MediumItalic",style:"italic"}) +
		fontParseHelper({weight:"300",name:"Roboto-LightItalic",style:"italic"}) +
		fontParseHelper({weight:"100",name:"Roboto-Thin"}) +
		fontParseHelper({weight:"100",name:"Roboto-ThinIalic",style:"italic"}) +
		fontParseHelper({family:"Noto Sans CJK",weight:"500",name:"NotoSansCJKjp-Medium",format:"opentype",extension:"otf"}) +
		fontParseHelper({family:"Noto Sans CJK",name:"NotoSansCJKjp-Regular",format:"opentype",extension:"otf"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansHI-Medium",range:"U+0900-097F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansHI-Regular",range:"U+0900-097F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansArabic-Medium",
			range:"U+0600-06FF,U+0750–077F,U+08A0–08FF,U+FB50–FDFF,U+FE70–FEFF,U+10E60–10E7F,U+1EE00—1EEFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansArabic-Regular",
			range:"U+0600-06FF,U+0750–077F,U+08A0–08FF,U+FB50–FDFF,U+FE70–FEFF,U+10E60–10E7F,U+1EE00—1EEFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansArmenian-Medium",range:"U+0530-0580"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansArmenian-Regular",range:"U+0530-0580"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansBengali-Medium",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBengali-Regular",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansBengali-Medium",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBengali-Regular",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBrahmi",range:"U+11000-1107F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBuginese",range:"U+1A00-1A1B,U+1A1E-1A1F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBuhid-Regular",range:"U+1740-1753"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCanadianAboriginal",range:"U+1400-167F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCarian-Regular",range:"U+102A0-102DF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansChakma-Regular",range:"U+11100-1114F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCherokee-Regular",range:"U+11100-1114F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansCherokee-Medium",
			range:"U+13A0-13F4,U+13F5,U+13F8-13FD"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCherokee-Regular",
			range:"U+13A0-13F4,U+13F5,U+13F8-13FD"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansEthiopic-Medium",range:"U+1200-137F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansEthiopic-Regular",range:"U+1200-137F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansGeorgian-Medium",
			range:"U+10A0-10FF,U+2D00-2D2F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansGeorgian-Regular",
			range:"U+10A0-10FF,U+2D00-2D2F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansGujaratiUI-Bold",range:"U+0A80-0AFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansGujaratiUI",range:"U+0A80-0AFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansHebrew-Bold",range:"U+0590-05FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansHebrew-Regular",range:"U+0590-05FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansJavanese",range:"U+A980-A9DF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansKannadaUI-Bold",range:"U+0C80-0CFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansKannadaUI",range:"U+0C80-0CFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansKayahLi-Regular",range:"U+A900-A92F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansKhmerUI-Medium",range:"U+1780-17FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansKhmerUI-Regular",range:"U+1780-17FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansLaoUI-Medium",range:"U+0E80-0EFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansLaoUI-Regular",range:"U+0E80-0EFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansLisu-Regular",range:"U+A4D0-A4FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansMalayalamUI-Bold",range:"U+0D00-0D7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansMalayalamUI",range:"U+0D00-0D7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansMyanmarUI-Bold",range:"U+1000-109F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansMyanmarUI-Regular",range:"U+1000-109F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansOriyaUI-Medium",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOriyaUI",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansOriyaUI-Bold",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOsage-Regular",range:"U+104B0-104FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOsmanya-Regular",range:"U+10480-104AF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansPhagsPa",range:"U+A840-A87F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansNewTaiLue-Regular",range:"U+1980-19DF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansNKo-Regular",range:"U+07C0-07FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOlChiki-Regular",range:"U+1C50–1C7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansRunic-Regular",range:"U+16A0-16FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansShavian-Regular",range:"U+16A0-16FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSinhalaUI-Regular",range:"U+0D80-0DFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansSinhalaUI-Medium",range:"U+0D80-0DFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSundanese",range:"U+1B80-1BBF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSyriacEastern",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSyriacWestern",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSyriacEstrangela",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTagalog",range:"U+1700-171F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTagbanwa",range:"U+1760-177F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTaiLe",range:"U+1950-197F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTaiTham",range:"U+1A20-1AAF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTaiViet",range:"U+AA80-AADF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTamilUI-Regular",range:"U+0B80-0BFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTamilUI-Medium",range:"U+0B80-0BFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTeluguUI",range:"U+0C00-0C7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTeluguUI-Bold",range:"U+0C00-0C7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansThaana",range:"U+0780-07BF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansThaana-Bold",range:"U+0780-07BF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansThaiUI-Regular",range:"U+0E00-0E7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansThaiUI-Medium",range:"U+0E00-0E7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTibetan",range:"U+0F00-0FFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTibetan-Bold",range:"U+0F00-0FFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTifinagh-Regular",range:"U+2D30-2D7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansVai-Regular",range:"U+A500-A63F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansYi-Regular",range:"U+A000-A48F"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono-Regular"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono-Medium"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono-Italic",style:"italic"}) +
		fontParseHelper({family:"RobotoMono",weight:"300",name:"RobotoMono-Light"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono-MediumItalic",style:"italic"}) +
		fontParseHelper({family:"RobotoMono",weight:"300",name:"RobotoMono-LightItalic",style:"italic"}) +
		fontParseHelper({family:"RobotoMono",weight:"100",name:"RobotoMono-Thin"}) +
		fontParseHelper({family:"RobotoMono",weight:"100",name:"RobotoMono-ThinIalic",style:"italic"})
	));
}
