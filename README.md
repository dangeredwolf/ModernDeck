# ![ModernDeck Logo](https://github.com/dangeredwolf/ModernDeck/raw/master/docs/img/ReadmeLogo.png)

[![Build Status](https://travis-ci.org/dangeredwolf/ModernDeck.svg?branch=master)](https://travis-ci.org/dangeredwolf/ModernDeck)
[![Crowdin](https://badges.crowdin.net/tweetdeck/localized.svg)](https://translate.moderndeck.org/project/tweetdeck)

ModernDeck takes TweetDeck to the next level with a Material-inspired theme, customization and performance enhancements, and more. Available as a desktop app or a browser extension.

[![Flathub](https://github.com/dangeredwolf/ModernDeck/raw/master/docs/img/Flathub.png)](https://flathub.org/apps/details/com.dangeredwolf.ModernDeck) [![Chrome Web Store](https://github.com/dangeredwolf/ModernDeck/blob/master/docs/img/ChromeWebStore.png)](https://chrome.google.com/webstore/detail/moderndeck-twitter-client/pbpfgdgddpnbjcbpofmdanfbbigocklj) [![Firefox Addons](https://github.com/dangeredwolf/ModernDeck/raw/master/docs/img/FirefoxAddon.png)](https://addons.mozilla.org/en-US/firefox/addon/moderndeck/)

![ModernDeck Screenshot](https://raw.githubusercontent.com/dangeredwolf/ModernDeck/master/docs/img/ReadmeScreenshot.png)

ModernDeck is designed by dangeredwolf and released under the MIT License.


## Building ModernDeck


### Dependencies

Building ModernDeck requires Node.js. ModernDeck is currently built on Node 17 but anything Node 14 and later will likely work fine.


#### Windows

To build on Windows, get [Node.js](https://nodejs.org/en/) and [Git](https://git-scm.com/download/win).




#### macOS

For macOS, you can install the necessary packages using [Homebrew](https://brew.sh/).

`brew install git node`

Alternatively you can get Node from [here](https://nodejs.org/en/) and use Xcode Command Line Tools's built-in Git.



#### Linux

On Linux, it varies depending on your distribution. Here's some popular examples:

`sudo apt install git nodejs` (Debian / Ubuntu-based)

`sudo pacman -S git nodejs` (Arch-based)

`sudo dnf install nodejs` (Fedora-based)



### Checking out

Clone the repository in your terminal of choice.

`git clone https://github.com/dangeredwolf/ModernDeck.git && cd ModernDeck`

Finally, install all the necessary NPM dependencies.

`npm install`

ℹ This'll take a few minutes, especially on slower internet connections.



### Building the Electron app

From the main folder where you just were, you can run the app for testing using:

`npm start`

This will run rollup and create an electron instance for it.

ℹ Building ModernDeck's source with Rollup increments the Build number as well

To start without building...
`npm run startNoBuild`

To update language data (DataI18n) from tweetdeck-i18n.csv...
`npm run updatei18n`

If you want to create the proper installers, you can run:

`npm run build`
...to build for every platform your OS supports building for

`npm run buildWindows`
...to build for Windows

`npm run buildMac`
...to build for macOS

`npm run buildLinux`
...to build for Linux

ModernDeck also includes `build.bat` for Windows.
It requires Windows 10/Windows Server 2019 or later, with WSL installed (including wsl.exe), with the proper tools (node, npm) installed on both WSL and Windows. This makes it very quick to build for every platform, including extension, except macOS, particularly because it doesn't require the electron build server.




⚠ Building for macOS requires running under macOS. Under macOS, you can build for Windows, macOS, and Linux. Under both Linux and Windows, you can build for both Linux and Windows. (Windows requires WSL, see above)




### Building the browser extension

First, you need to run rollup.

`npm run rollup`

This will transpile ModernDeck source and dependencies into a single moderndeck.js file. This needs to be run if you make JS changes under the ModernDeck/src directory

ℹ Building ModernDeck's source with Rollup increments the Build number as well

To test the extension, you'll want to load the unpacked extension. This, of course, varies by browser.


### Testing the browser extension

#### Chrome

Open the Chrome menu, go to **More tools > Extensions**

Turn on **Developer Mode** in the top right corner if you haven't already.

Click the **Load unpacked** button

Navigate to *ModernDeck/common* and click Select Folder


#### Firefox

Go to *about:debugging*

Click **This Firefox**

Click **Load Temporary Add-on...**

Navigate to *ModernDeck/common/manifest.json*


#### Microsoft Edge

Open the **...** menu

Click **Extensions**

Turn on **Developer Mode** in the bottom left corner if you haven't already

Click the **Load unpacked** button

Navigate to *ModernDeck/common* and click Select Folder

Microsoft Edge Legacy (The EdgeHTML-based browser) is no longer supported in ModernDeck 8.0 and later. It might still work, but no problems with it will be corrected.

#### Opera

Click the **Extensions** button in the bar on the left side (the icon looks like a box)

Turn on **Developer Mode** in the top right if you haven't already

Click **Load unpacked**

Select *ModernDeck/common* and click Select Folder


## Building Extension for Release

Run `node build/build.js` from the root ModernDeck directory. The corresponding ZIPs will appear in the dist folder.

## ❓ Problems or questions?

Don't hesitate to ask: [@dangeredwolf on Twitter](https://twitter.com/dangeredwolf), [@ModernDeck on Twitter](https://twitter.com/ModernDeck)

If you think you found an issue with ModernDeck, please open up an issue on GitHub.
