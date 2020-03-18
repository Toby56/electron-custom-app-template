const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

if (!app.requestSingleInstanceLock()) {
  console.log("Already instance running, quitting");
  app.quit();
} else {
  app.whenReady().then(() => {
    const {
      width,
      height,
      x,
      y
    } = (windowStateKeeper = require("electron-window-state")({
      defaultWidth: 800,
      defaultHeight: 600
    }));

    win = new BrowserWindow({
      x: x,
      y: y,
      width: width,
      height: height,
      frame: false,
      backgroundColor: "#222",
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, "preload.js")
      }
    });

    windowStateKeeper.manage(win);

    win.loadFile("src/index.html");

    app.on("second-instance", () => {
      console.log("Another instance tried to launch");
      if (win.isMinimized()) win.restore();
      if (win.isHidden()) win.show();
      win.focus();
    });

    win.webContents.on("will-navigate", (event, url) => {
      if (new URL(contents.getURL()).origin != new URL(url).origin) {
        console.log("Opening url in external browser:", url);
        event.preventDefault();
        shell.openExternal(url);
      } else {
        console.log("Loading URL:", url);
      }
    });

    win.webContents.on("new-window", (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
  });
}
