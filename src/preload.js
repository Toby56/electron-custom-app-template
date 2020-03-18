document.addEventListener("DOMContentLoaded", () => {
  var win = require("electron").remote.getCurrentWindow();

  {
    const types = {
      minimize: "min",
      maximize: "max",
      restore: "restore",
      close: "close"
    };
    const colors = {
      white: "w",
      black: "k"
    };
    const sizes = {
      "1": "10",
      "1.25": "12",
      "1.5": "15",
      "1.75": "15",
      "2": "20",
      "2.25": "20",
      "2.5": "24",
      "3": "30",
      "3.5": "30"
    };

    Object.keys(types).forEach(type => {
      Object.keys(colors).forEach(color => {
        let srcset = [];
        Object.keys(sizes).forEach(size => {
          srcset.push(
            `icons/${types[type]}-${colors[color]}-${sizes[size]}.png ${size}x`
          );
        });
        document.querySelector(
          `#titlebar-button-${type} .icon-${color}`
        ).srcset = srcset.join(", ");
      });
    });
  }

  events = {
    "page-title-updated": () => {
      document.getElementById("titlebar-text").innerHTML = document.title;
    },
    "maximize unmaximize": function toggleMaximized() {
      document.body.classList[win.isMaximized() ? "add" : "remove"](
        "maximized"
      );
    },
    "blur focus": () => {
      document.body.classList[win.isFocused() ? "remove" : "add"]("blurred");
    },
    "enter-full-screen leave-full-screen": function toggleFullScreen() {
      document.body.classList[win.isFullScreen() ? "add" : "remove"](
        "full-screen"
      );
    }
  };

  for (const event in events) {
    events[event]();
    event.split(" ").forEach(eventSplit => {
      win.on(eventSplit, events[event]);
      window.addEventListener("beforeunload", () => {
        win.removeListener(eventSplit, events[event]);
      });
    });
  }

  document
    .getElementById("titlebar-button-minimize")
    .addEventListener("click", () => {
      win.minimize();
    });

  document
    .getElementById("titlebar-button-maximize")
    .addEventListener("click", () => {
      win.maximize();
    });

  document
    .getElementById("titlebar-button-restore")
    .addEventListener("click", () => {
      win.isFullScreen() ? win.setFullScreen(false) : win.unmaximize();
    });

  document
    .getElementById("titlebar-button-close")
    .addEventListener("click", () => {
      win.close();
    });
});
