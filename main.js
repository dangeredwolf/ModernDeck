// Modules to control application life and create native browser window
const electron = require("electron");
const { app, BrowserWindow, ipcMain, session } = require('electron');
const serve = require('electron-serve');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDev = true;

const loadURL = serve({scheme:"moderndeck",directory:'ModernDeck'});

app.setAppUserModelId("com.dangeredwolf.ModernDeck");

function createWindow () {
  // Create the browser window.

  var display = {};


  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    scrollBounce:true,
    autoHideMenuBar:true,
    title:"ModernDeck",
    icon:__dirname+"ModernDeck/sources/favicon.ico",
    frame:false
  });


  mainWindow.webContents.on('dom-ready', (event, url) => {
    mainWindow.webContents.executeJavaScript('\
      document.querySelector("html").classList.add("mtd-app");\
      document.querySelectorAll("link[rel=\'stylesheet\']")[0].remove();\
      var injurl = document.createElement("div");\
      injurl.setAttribute("type","moderndeck://ModernDeck/");\
      injurl.id = "MTDURLExchange";document.head.appendChild(injurl);\
      \
      var InjectScript2 = document.createElement("script");\
      InjectScript2.src = "https://cdn.ravenjs.com/3.19.1/raven.min.js";\
      InjectScript2.type = "text/javascript";\
      document.head.appendChild(InjectScript2);\
      \
      var injStyles = document.createElement("link");\
      injStyles.rel = "stylesheet";\
      injStyles.href = "moderndeck://ModernDeck/sources/moderndeck.css";\
      document.head.appendChild(injStyles);\
      \
      var InjectScript = document.createElement("script");\
      InjectScript.src = "moderndeck://ModernDeck/sources/MTDinject.js";\
      InjectScript.type = "text/javascript";\
      document.head.appendChild(InjectScript);\
      ');
  });

  mainWindow.webContents.on('did-finish-load', (event, url) => {
    mainWindow.webContents.executeJavaScript('\
      setTimeout(function(){document.querySelector("header.app-header").setAttribute("style","");},1000);\
      ');
  });

    mainWindow.webContents.session.webRequest.onHeadersReceived(
      {urls:["https://tweetdeck.twitter.com/*","https://twitter.com/i/cards/*"]},
      (details, callback) => {
        var foo = details.responseHeaders;
        foo["content-security-policy"] =[
          "default-src 'self'; connect-src * moderndeck:; font-src https: data: * moderndeck:; frame-src https: moderndeck:; frame-ancestors 'self' https: moderndeck:; img-src https: data: moderndeck:; media-src * moderndeck:; object-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sentry.io https://cdn.jsdelivr.net https://ajax.googleapis.com moderndeck: https://cdn.ravenjs.com/ https://*.twitter.com https://*.twimg.com https://rawgit.com https://*.rawgit.com https://ssl.google-analytics.com https://api-ssl.bitly.com; style-src 'self' 'unsafe-inline' 'unsafe-eval' https: moderndeck:;"];
        callback({ responseHeaders: foo});
      }
    );

  mainWindow.loadURL("https://tweetdeck.twitter.com");
  // Open the DevTools.
   mainWindow.webContents.openDevTools();



  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
