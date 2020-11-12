# ModernDeck

[![Build Status](https://travis-ci.org/dangeredwolf/ModernDeck.svg?branch=master)](https://travis-ci.org/dangeredwolf/ModernDeck)
[![dependencies Status](https://david-dm.org/dangeredwolf/ModernDeck/status.svg)](https://david-dm.org/dangeredwolf/ModernDeck)
[![devDependencies Status](https://david-dm.org/dangeredwolf/ModernDeck/dev-status.svg)](https://david-dm.org/dangeredwolf/ModernDeck?type=dev)
[![Crowdin](https://badges.crowdin.net/tweetdeck/localized.svg)](https://translate.moderndeck.org/project/tweetdeck)

ModernDeck is an app/extension running atop TweetDeck that brings a new, Material Design-inspired interface, as well as new customization features.

![ModernDeck Screenshot](https://github.com/dangeredwolf/ModernDeck/raw/8.0/build/en_screenshot.png)

ModernDeck is designed by dangeredwolf and released under the MIT License.


## Building ModernDeck


### Dependencies

To build ModernDeck, you need to first install Node.js (which comes with npm) and git if you don't have it installed already

ℹ *ModernDeck is tested against the latest current version of Node.js, but it will likely work fine with the LTS version as well.*


#### Windows

For Windows, [you can download Node.js here](https://nodejs.org/en/)

⚠ *On Windows, you will need to download git if you haven't yet already. You can either [download just git itself](https://git-scm.com/download/win), or [download GitHub's Windows client](https://desktop.github.com/), which also includes git and other tools, even if you don't use the GUI portion.*


#### macOS

For macOS, you can install the necessary packages using [Homebrew](https://brew.sh/).

`brew install git node`

ℹ *Xcode Command Line Tools also include git. If you already have it, you can remove "git" from the command.*

❓ *[Alternatively, you can also install nodejs using the .pkg installer](https://nodejs.org/en/)*



#### Linux

On Linux, it varies depending on your distribution. If you're using Ubuntu or Debian, you just need to run:

`sudo apt install git nodejs`



### Checking out

You'll want to use your Terminal (macOS and Linux) or PowerShell (Windows) for this.

First, of course, `cd` into a directory where you want to clone the source to.

Next, clone the git.

`git clone https://github.com/dangeredwolf/ModernDeck.git`

Finally, install all the necessary NPM dependencies

`npm install`

ℹ *This may take several minutes*



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

[Click here for more information about electron-builder code signing.](https://www.electron.build/code-signing)

ModernDeck also includes `build.bat` for Windows.
It requires Windows 10 or Windows Server 2019, with WSL installed (including wsl.exe), with the proper tools (node, npm) installed on both WSL and Windows.

This makes it very quick to build for every platform, including extension, except macOS, particularly because it doesn't require the electron build server.


❓ *For more advanced users, you may prefer to [run electron-builder directly.](https://www.electron.build/)*

⚠ *Building for macOS requires running under macOS. Under macOS, you can build for Windows, macOS, and Linux. Under both Linux and Windows, you can build for both Linux and Windows. (Windows requires WSL, see above)*


### Building the browser extension

First, you need to run rollup.

`npm run rollup`

This will transpile moderndeck.js and dependencies. This needs to be run if you make JS changes under the ModernDeck/src directory

ℹ Building ModernDeck's source with Rollup increments the Build number as well

To test the extension, you'll want to load the unpacked extension. This, of course, varies by browser.


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

Microsoft Edge Legacy (The EdgeHTML-based browser) is no longer supported as of ModernDeck 8.0. It might still work, but no problems with it will be corrected.

#### Opera

Click the **Extensions** button in the bar on the left side (the icon looks like a box)

Turn on **Developer Mode** in the top right if you haven't already

Click **Load unpacked**

Select *ModernDeck/common* and click Select Folder


## Building Extension for Release

Run `npm install && node build/build.js` from the root ModernDeck directory. The corresponding ZIPs will appear in the dist folder

## ❓ Problems or questions?

Don't hesitate to ask!
[twitter@dangeredwolf](https://twitter.com/dangeredwolf), [twitter@ModernDeck](https://twitter.com/ModernDeck), or [telegram@dangeredwolf](https://t.me/dangeredwolf)
