const https = require('https');
const { app, protocol } = require("electron");
const Store = require("electron-store");
const store = new Store({name:"mtdsettings"});

let htmlTemplate;

class NitroLoad {
    static set bundle(str) {
        return store.set("mtd_nitroload_bundle", str);
    }

    static set vendor(str) {
        return store.set("mtd_nitroload_vendor", str);
    }

    static get bundle() {
        return store.get("mtd_nitroload_bundle");
    }

    static get vendor() {
        return store.get("mtd_nitroload_vendor");
    }

    static ready() {
        return !!this.vendor && !!this.bundle
    }

    static async updateSaved() {
        let response = await NitroLoad.requestTweetDeckHTTPS();

        try {
            NitroLoad.vendor = response.match(/https:\/\/ton\.twimg\.com\/tweetdeck-web\/web\/dist\/vendor\.[a-f0-9]{10}\.js/g)[0];
            NitroLoad.bundle = response.match(/https:\/\/ton\.twimg\.com\/tweetdeck-web\/web\/dist\/bundle\.[a-f0-9]{10}\.js/g)[0];
        } catch (e) {
            throw "NitroLoad couldn't locate the vendor and bundle properties: " + e;
        }

        return true;
    }

    static goReplace() {
        // protocol.interceptBufferProtocol("https", (request, result) => {
        //     if (request.url === "https://tweetdeck.twitter.com/")
        //         return result(NitroLoad.buffer);
        // });
        return;
        protocol.interceptStringProtocol("https", (request, result) => {
            if (request.url === "https://tweetdeck.twitter.com/") {

                protocol.uninterceptProtocol("https");

                return result(`
                    <html class="scroll-v mtd-nitroload mtd-js-app" lang=en-US>
                        <head>
                            <meta charset=utf-8>
                            <meta content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=yes" name=viewport>
                            <style>
                                @font-face{font-family:'MD';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/mdvectors.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Material';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/MaterialIcons.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Roboto';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/Roboto-Regular.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Roboto';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/Roboto-Medium.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Roboto';font-style:italic;font-weight:400;src:url(moderndeck://sources/fonts/Roboto-Italic.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Roboto';font-style:normal;font-weight:300;src:url(moderndeck://sources/fonts/Roboto-Light.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Roboto';font-style:italic;font-weight:500;src:url(moderndeck://sources/fonts/Roboto-MediumItalic.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Roboto';font-style:italic;font-weight:300;src:url(moderndeck://sources/fonts/Roboto-LightItalic.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Roboto';font-style:normal;font-weight:100;src:url(moderndeck://sources/fonts/Roboto-Thin.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Roboto';font-style:italic;font-weight:100;src:url(moderndeck://sources/fonts/Roboto-ThinIalic.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Noto Sans CJK';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansCJKjp-Medium.otf) format('opentype');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Noto Sans CJK';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansCJKjp-Regular.otf) format('opentype');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansHI-Medium.woff2) format('woff2');unicode-range:U+0900-097F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansHI-Regular.woff2) format('woff2');unicode-range:U+0900-097F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansArabic-Medium.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750–077F,U+08A0–08FF,U+FB50–FDFF,U+FE70–FEFF,U+10E60–10E7F,U+1EE00—1EEFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansArabic-Regular.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750–077F,U+08A0–08FF,U+FB50–FDFF,U+FE70–FEFF,U+10E60–10E7F,U+1EE00—1EEFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansArmenian-Medium.woff2) format('woff2');unicode-range:U+0530-0580}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansArmenian-Regular.woff2) format('woff2');unicode-range:U+0530-0580}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansBengali-Medium.woff2) format('woff2');unicode-range:U+0980-09FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansBengali-Regular.woff2) format('woff2');unicode-range:U+0980-09FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansBengali-Medium.woff2) format('woff2');unicode-range:U+0980-09FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansBengali-Regular.woff2) format('woff2');unicode-range:U+0980-09FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansBrahmi.woff2) format('woff2');unicode-range:U+11000-1107F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansBuginese.woff2) format('woff2');unicode-range:U+1A00-1A1B,U+1A1E-1A1F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansBuhid-Regular.woff2) format('woff2');unicode-range:U+1740-1753}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansCanadianAboriginal.woff2) format('woff2');unicode-range:U+1400-167F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansCarian-Regular.woff2) format('woff2');unicode-range:U+102A0-102DF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansChakma-Regular.woff2) format('woff2');unicode-range:U+11100-1114F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansCherokee-Regular.woff2) format('woff2');unicode-range:U+11100-1114F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansCherokee-Medium.woff2) format('woff2');unicode-range:U+13A0-13F4,U+13F5,U+13F8-13FD}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansCherokee-Regular.woff2) format('woff2');unicode-range:U+13A0-13F4,U+13F5,U+13F8-13FD}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansEthiopic-Medium.woff2) format('woff2');unicode-range:U+1200-137F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansEthiopic-Regular.woff2) format('woff2');unicode-range:U+1200-137F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansGeorgian-Medium.woff2) format('woff2');unicode-range:U+10A0-10FF,U+2D00-2D2F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansGeorgian-Regular.woff2) format('woff2');unicode-range:U+10A0-10FF,U+2D00-2D2F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansGujaratiUI-Bold.woff2) format('woff2');unicode-range:U+0A80-0AFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansGujaratiUI.woff2) format('woff2');unicode-range:U+0A80-0AFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansHebrew-Bold.woff2) format('woff2');unicode-range:U+0590-05FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansHebrew-Regular.woff2) format('woff2');unicode-range:U+0590-05FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansJavanese.woff2) format('woff2');unicode-range:U+A980-A9DF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansKannadaUI-Bold.woff2) format('woff2');unicode-range:U+0C80-0CFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansKannadaUI.woff2) format('woff2');unicode-range:U+0C80-0CFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansKayahLi-Regular.woff2) format('woff2');unicode-range:U+A900-A92F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansKhmerUI-Medium.woff2) format('woff2');unicode-range:U+1780-17FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansKhmerUI-Regular.woff2) format('woff2');unicode-range:U+1780-17FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansLaoUI-Medium.woff2) format('woff2');unicode-range:U+0E80-0EFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansLaoUI-Regular.woff2) format('woff2');unicode-range:U+0E80-0EFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansLisu-Regular.woff2) format('woff2');unicode-range:U+A4D0-A4FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansMalayalamUI-Bold.woff2) format('woff2');unicode-range:U+0D00-0D7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansMalayalamUI.woff2) format('woff2');unicode-range:U+0D00-0D7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansMyanmarUI-Bold.woff2) format('woff2');unicode-range:U+1000-109F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansMyanmarUI-Regular.woff2) format('woff2');unicode-range:U+1000-109F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansOriyaUI-Medium.woff2) format('woff2');unicode-range:U+0B00-0B7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansOriyaUI.woff2) format('woff2');unicode-range:U+0B00-0B7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansOriyaUI-Bold.woff2) format('woff2');unicode-range:U+0B00-0B7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansOsage-Regular.woff2) format('woff2');unicode-range:U+104B0-104FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansOsmanya-Regular.woff2) format('woff2');unicode-range:U+10480-104AF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansPhagsPa.woff2) format('woff2');unicode-range:U+A840-A87F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansNewTaiLue-Regular.woff2) format('woff2');unicode-range:U+1980-19DF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansNKo-Regular.woff2) format('woff2');unicode-range:U+07C0-07FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansOlChiki-Regular.woff2) format('woff2');unicode-range:U+1C50–1C7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansRunic-Regular.woff2) format('woff2');unicode-range:U+16A0-16FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansShavian-Regular.woff2) format('woff2');unicode-range:U+16A0-16FF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansSinhalaUI-Regular.woff2) format('woff2');unicode-range:U+0D80-0DFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansSinhalaUI-Medium.woff2) format('woff2');unicode-range:U+0D80-0DFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansSundanese.woff2) format('woff2');unicode-range:U+1B80-1BBF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansSyriacEastern.woff2) format('woff2');unicode-range:U+0700-074F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansSyriacWestern.woff2) format('woff2');unicode-range:U+0700-074F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansSyriacEstrangela.woff2) format('woff2');unicode-range:U+0700-074F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansTagalog.woff2) format('woff2');unicode-range:U+1700-171F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansTagbanwa.woff2) format('woff2');unicode-range:U+1760-177F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansTaiLe.woff2) format('woff2');unicode-range:U+1950-197F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansTaiTham.woff2) format('woff2');unicode-range:U+1A20-1AAF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansTaiViet.woff2) format('woff2');unicode-range:U+AA80-AADF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansTamilUI-Regular.woff2) format('woff2');unicode-range:U+0B80-0BFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansTamilUI-Medium.woff2) format('woff2');unicode-range:U+0B80-0BFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansTeluguUI.woff2) format('woff2');unicode-range:U+0C00-0C7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansTeluguUI-Bold.woff2) format('woff2');unicode-range:U+0C00-0C7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansThaana.woff2) format('woff2');unicode-range:U+0780-07BF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansThaana-Bold.woff2) format('woff2');unicode-range:U+0780-07BF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansThaiUI-Regular.woff2) format('woff2');unicode-range:U+0E00-0E7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansThaiUI-Medium.woff2) format('woff2');unicode-range:U+0E00-0E7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/NotoSansTibetan.woff2) format('woff2');unicode-range:U+0F00-0FFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansTibetan-Bold.woff2) format('woff2');unicode-range:U+0F00-0FFF}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansTifinagh-Regular.woff2) format('woff2');unicode-range:U+2D30-2D7F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansVai-Regular.woff2) format('woff2');unicode-range:U+A500-A63F}
                                @font-face{font-family:'Noto Sans';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/NotoSansYi-Regular.woff2) format('woff2');unicode-range:U+A000-A48F}
                                @font-face{font-family:'RobotoMono';font-style:normal;font-weight:400;src:url(moderndeck://sources/fonts/RobotoMono-Regular.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'RobotoMono';font-style:normal;font-weight:500;src:url(moderndeck://sources/fonts/RobotoMono-Medium.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'RobotoMono';font-style:italic;font-weight:400;src:url(moderndeck://sources/fonts/RobotoMono-Italic.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'RobotoMono';font-style:normal;font-weight:300;src:url(moderndeck://sources/fonts/RobotoMono-Light.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'RobotoMono';font-style:italic;font-weight:500;src:url(moderndeck://sources/fonts/RobotoMono-MediumItalic.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'RobotoMono';font-style:italic;font-weight:300;src:url(moderndeck://sources/fonts/RobotoMono-LightItalic.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'RobotoMono';font-style:normal;font-weight:100;src:url(moderndeck://sources/fonts/RobotoMono-Thin.woff2) format('woff2');unicode-range:U+0000-FFFF}
                                @font-face{font-family:'RobotoMono';font-style:italic;font-weight:100;src:url(moderndeck://sources/fonts/RobotoMono-ThinIalic.woff2) format('woff2');unicode-range:U+0000-FFFF}
                            </style>
                            <link rel="stylesheet" href="moderndeck://sources/moderndeck.css">
                            <div type="moderndeck://" id="MTDURLExchange"></div>
                            <script src="https://cdn.ravenjs.com/3.19.1/raven.min.js" type="text/javascript"></script>
                        </head>
                        <body class=scroll-v>
                        <audio id=update-sound preload=auto style=display:none>
                            <source src=https://ton.twimg.com/tweetdeck-web/web/assets/sounds/tweet.a0da953980.mp3 type=audio/mp3>
                        </audio>
                        <div class="js-app-loading login-container">
                            <div class="block txt-center ovl-plain">
                                <div class="ovl-block sign-in">
                                    <div class="block txt-center js-signin-ui">
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div class="is-hidden js-message-banner message-banner"></div>
                            <div class="is-hidden application js-app"></div>
                            <div class=js-modals-container></div>
                            <script src=moderndeck://./vendor.js></script>
                            <script src=moderndeck://./bundle.js></script>
                            <script src="moderndeck://sources/libraries/moduleraid.min.js"></script>
                            <script src="moderndeck://sources/moderndeck.js" type="text/javascript"></script>
                            <script src="moderndeck://sources/libraries/jquery.visible.js" type="text/javascript"></script>
                        </body>`);
            }

        });
    }

    static makePage() {
        return NitroLoad.htmlTemplate;
    }

    /** @PRIVATE */
    static async requestTweetDeckHTTPS() {
        return new Promise((resolve, reject) => {
            https.get("https://tweetdeck.twitter.com", (response) => {
                response.on("data", (chunk) => {
                    resolve(chunk+"");
                });
            }).on("error", (e) => {
                reject(e);
            });
        })
    }

    htmlTemplate =
    `<html class=scroll-v lang=en-US>
        <meta charset=utf-8>
        <meta content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=yes" name=viewport>
        <body class=scroll-v>
            <audio id=update-sound preload=auto
            src=moderndeck://sources/alert_2.mp3 style=display:none>
            </audio>
            <div class="js-app-loading login-container">
                <div class="block txt-center ovl-plain">
                    <div class="ovl-block sign-in">
                        <div class="block txt-center js-signin-ui">
                            <div class="preloader-wrapper big active">
                                <div class="spinner-layer">
                                    <div class="circle-clipper left">
                                        <div class="circle">
                                        </div>
                                    </div>
                                    <div class="gap-patch">
                                        <div class="circle">
                                        </div>
                                    </div>
                                    <div class="circle-clipper right">
                                        <div class="circle">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="is-hidden js-message-banner message-banner">
            </div>
            <div class="is-hidden application js-app">
            </div>
            <div class=js-modals-container>
            </div>
        </body>
    </html>`;
    buffer = new Buffer(this.htmlTemplate);
}


exports.NitroLoad = NitroLoad;
