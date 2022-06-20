import { app, BrowserWindow, Notification } from "electron";
import * as path from "path";
import * as url from "url";

let mainWindow: Electron.BrowserWindow | null;

const NOTIFICATION_TITLE = "Vidocto notification";
const NOTIFICATION_BODY = "Click the notification to open app";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL(`http://localhost:4000`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }
  if (process.platform === "darwin") {
    app?.dock?.hide();
    mainWindow.setAlwaysOnTop(true, "floating", 1);
  } else {
    mainWindow.setAlwaysOnTop(true, "pop-up-menu", 1);
  }
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.fullScreenable = false;
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// function showNotification () {
//   new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
// }

app.whenReady().then(() => {
  // showNotification()
  // setInterval(showNotification, 5000)
});

const startApp = () => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
};

app.on("ready", startApp);
app.on("window-all-closed", function () {
  app.quit();
});
app.allowRendererProcessReuse = true;
