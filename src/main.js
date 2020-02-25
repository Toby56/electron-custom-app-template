const electron = require("electron");

electron.app.whenReady().then(() => {
  const { width, height, x, y } = (windowStateKeeper = require("electron-window-state")({
    defaultWidth: 800,
    defaultHeight: 600
  }));

  win = new electron.BrowserWindow({
    x: x,
    y: y,
    width: width,
    height: height,
    frame: false,
    backgroundColor: "#222",
    webPreferences: { nodeIntegration: true }
  });

  win.loadFile("src/index.html");

  windowStateKeeper.manage(win);

  win.webContents.on("dom-ready", () => {
    win.webContents.executeJavaScript(
      "(" +
        (() => {
          const remote = require("electron").remote;

          var win = remote.getCurrentWindow();

          document.getElementById("window-title").innerHTML = document.title;

          new MutationObserver(function(mutations) {
            document.getElementById("window-title").innerHTML = mutations[0].target.data;
          }).observe(document.querySelector("title"), { characterData: true, subtree: true });

          document.getElementById("window-controls-minimize").addEventListener("click", event => {
            win.minimize();
          });

          document.getElementById("window-controls-maximize").addEventListener("click", event => {
            win.maximize();
          });

          document.getElementById("window-controls-restore").addEventListener("click", event => {
            if (win.isFullScreen()) {
              win.setFullScreen(false);
            } else {
              win.unmaximize();
            }
          });

          document.getElementById("window-controls-close").addEventListener("click", event => {
            win.close();
          });

          toggleMaximized();
          win.on("maximize", toggleMaximized);
          win.on("unmaximize", toggleMaximized);

          function toggleMaximized() {
            if (win.isMaximized()) {
              document.body.classList.add("maximized");
            } else {
              document.body.classList.remove("maximized");
            }
          }

          toggleBlurred();
          win.on("blur", toggleBlurred);
          win.on("focus", toggleBlurred);

          function toggleBlurred() {
            if (win.isFocused()) {
              document.body.classList.remove("blurred");
            } else {
              document.body.classList.add("blurred");
            }
          }

          toggleFullScreen();
          win.on("enter-full-screen", toggleFullScreen);
          win.on("leave-full-screen", toggleFullScreen);

          function toggleFullScreen() {
            if (win.isFullScreen()) {
              document.body.classList.add("full-screen");
            } else {
              document.body.classList.remove("full-screen");
            }
          }
        }).toString() +
        ")()"
    );
  });
});
