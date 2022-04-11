/*!
 * ModernDeck 10.0.0, built 2022-04-11T09:59:26.351Z
 *
 * (c) 2014-2022 dangered wolf, released under MIT license.
 *
 * Made with <3
 *
 */(()=>{"use strict";const package_namespaceObject={i8:"10.0.0"};function getSystemName(){return navigator.userAgent.indexOf("Windows NT")>0?"Windows":navigator.userAgent.indexOf("Mac OS X")>0&&navigator.userAgent.indexOf("Mobile")>0?"iOS":navigator.userAgent.indexOf("Mac OS X")>0?"macOS":navigator.userAgent.indexOf("Android")>0?"Android":navigator.userAgent.indexOf("Linux")>0?"Linux":"Unknown System"}let ModernDeck={version:10,versionString:package_namespaceObject.i8,versionFriendlyString:package_namespaceObject.i8.replace(/\.0$/,""),platformName:function(){let browserName="Unknown Browser";return navigator.userAgent.indexOf("ModernDeck/")>0?(browserName=getSystemName(),browserName+=` (${"x64"===process.arch?"amd64":process.arch})`,document.getElementsByTagName("html")[0].classList.contains("mtd-winstore")&&(browserName+=" Microsoft Store"),document.getElementsByTagName("html")[0].classList.contains("mtd-macappstore")&&(browserName+=" Mac App Store"),browserName):(navigator.userAgent.indexOf("Gecko/")>0?browserName="Firefox":navigator.userAgent.indexOf("Edg/")>0?browserName="Edge":navigator.userAgent.indexOf("OPR/")>0?browserName="Opera":navigator.userAgent.indexOf("Chrome/")>0?browserName="Chrome":navigator.userAgent.indexOf("Safari/")>0&&(browserName="Safari"),`${browserName} (${getSystemName()})`)}(),productName:"ModernDeck 10",systemName:getSystemName(),buildNumber:1630};window.ModernDeck=ModernDeck;var AsciiArtController=function(){function AsciiArtController(){}return AsciiArtController.draw=function(){var text="\n    █████████████████████████████████████████\n   ███████████████████████████████████████████\n  █████████████████████████████████████████████\n  █████████████     ████████      ▐████████████\n  ███████████▌     ███████         ▐███████████\n  ██████████      ███████     ██    ▐██████████\n  ████████▌     ████████     ████    ▐█████████   ModernDeck ".concat(ModernDeck.versionFriendlyString,"\n  ███████▌     ███████     ███████     ████████   Build ").concat(ModernDeck.buildNumber,"\n  ████████     ██████     ███████     ▐████████   ").concat(ModernDeck.platformName,"\n  █████████▌     ███     ███████     ▐█████████\n  ███████████           ███████     ███████████   Made with love\n  ████████████        ███████     ▐████████████   by dangered wolf\n  █████████████████████████████████████████████\n  ████████████████████████████████████████████▌\n   ██████████████████████████████████████████▌\n    ████████████████████████████████████████▌\n                 ██████████████▌\n                   ██████████▌\n                     ██████▌\n");navigator.userAgent.indexOf("Chrome/")>0&&document.getElementsByTagName("html")[0].prepend(document.createComment(text))},AsciiArtController}();function t(){return(t=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var o in s)Object.prototype.hasOwnProperty.call(s,o)&&(t[o]=s[o])}return t}).apply(this,arguments)}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
//# sourceMappingURL=moderndeck.js.map