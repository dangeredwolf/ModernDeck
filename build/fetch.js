/*
    fetch.js

    Copyright (c) 2014-2021 dangered wolf, et al
    Released under the MIT License
*/

const https = require("https");
const path = require("path");
const fs = require("fs");

let vendorVersion = "";
let bundleVersion = "";

let pageContent = "";

let noWrite = false;
let forceUpdate = false;

console.log("  =========== ModernDeck TweetDeck updater ===========");
console.log("  Contacting tweetdeck.twitter.com...");

function clearBundleSources() {
    for (const file of fs.readdirSync("./tweetdeck-tmp")) {
        if (file.match("vendor") === null)
    	   fs.unlinkSync(path.join("./tweetdeck-tmp", file));
    }
}
function clearVendorSources() {
    for (const file of fs.readdirSync("./tweetdeck-tmp")) {
        if (file.match("vendor") !== null)
    	   fs.unlinkSync(path.join("./tweetdeck-tmp", file));
    }
}

function processPage() {
    let jsFiles = [];

    try {
	    for (const file of fs.readdirSync("./tweetdeck-tmp")) {
		    // fs.unlinkSync(path.join("./tweetdeck-tmp", file));
            if (file.match("vendor") !== null) {
                vendorVersion = file.match(/(?<=vendor\.)[a-f0-9]+(?=\.js)/g)[0] || "";
            } else if (file.match("bundle") !== null) {
                bundleVersion = file.match(/(?<=bundle\.)[a-f0-9]+(?=\.js)/g)[0] || "";
            }
	    }
    } catch(e) {}

    try {
	    fs.mkdirSync("./tweetdeck-tmp")
    } catch(e) {
    }

    pageContent.match(/https:\/\/[\w\.\d\/\-\%]+\.js/g).forEach((a) => {
        var data = "";
        console.log("  Found JS file " + a + " on page.");
        let distFileName = "";

        if (a.match("bundle") !== null) {
            let version = a.match(/(?<=bundle\.)[a-f0-9]+(?=\.js)/g)[0];
            distFileName = "bundle";
            if (version !== bundleVersion) {
                console.log("  UPDATED - bundle.js (" + bundleVersion + " -> " + version + ")");
                clearBundleSources();
            } else {
                console.log("  UP-TO-DATE - bundle.js (" + version + ")");
                if (!forceUpdate) {
                    return;
                }
            }
        } else if (a.match("vendor") !== null) {
            let version = a.match(/(?<=vendor\.)[a-f0-9]+(?=\.js)/g)[0];
            distFileName = "vendor";
            if (version !== vendorVersion) {
                console.log("  UPDATED - vendor.js (" + vendorVersion + " -> " + version + ")")
                clearVendorSources();
            } else {
                console.log("  UP-TO-DATE - vendor.js (" + version + ")");
                if (!forceUpdate) {
                    return;
                }
            }
        }

        let fileName = a.match(/[\w\d\.\-]+\.js/g)[0];

        https.get(a, (res) => {
            res.on("data", (d) => {
                data += d;
            });
            res.on("end", () => {
                console.log("  Writing file " + fileName);
                if (!noWrite)
                    fs.writeFileSync("./tweetdeck-tmp/" + fileName, data);

                if (fileName.match("bundle") !== null && !noWrite) {
                    stealDependencies(data);
                }
            });
        });

    });
}

function stealDependencies(bundleJs) {
    let o = [];
    let p = [];

    var whatever = true;

    bundleJs.match(/(?<=\+\"web\/dist\/\"\+\()[\:\,\"\d\w\(\)\{\}\~\.\-\[\]\|\+]+\}(?=\[.\]\+\"\.js\"\})/g)[0]
    .match(/\{[\w\.\:\"\~\-\,]+\}/g).forEach((json) => {
        let object = JSON.parse(json.replace(/(?<=[\,\{]\d?\d?)(?=\d?\d?[\:])/g,"\"").replace(/(?<=\d)\"(?=\d)/g,""));
        if (whatever) {
            for (var a in object) {
                o.push(object[a]);
            }
        } else {
            for (var b in object) {
                p.push(object[b]);
            }
        }
        whatever = false;
    })

    o.forEach((asdf, i) => {
        console.log("  Fetching additional JS file " + o[i] + "." + p[i] + ".js");
        let data = "";
        let fileName = o[i] + "." + p[i] + ".js";
        let baseURL = "https://ton.twimg.com/tweetdeck-web/web/dist/";
        https.get(baseURL + fileName, (res) => {
            res.on("data", (d) => {
                data += d;
            });
            res.on("end", () => {
                console.log("  Writing file " + fileName);
                fs.writeFileSync("./tweetdeck-tmp/" + fileName, data);

                if (fileName.match("bundle") !== null) {
                    stealDependencies(data);
                }
            });
        });

    })
}

https.get("https://tweetdeck.twitter.com", (res) => {
    console.log("  Loading tweetdeck.twitter.com...");
    res.on("data", (d) => {
        pageContent = d+""; // lazy cast to string
        processPage();
    });
});
