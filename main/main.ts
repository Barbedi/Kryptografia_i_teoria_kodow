import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import path from "path";
import { fileURLToPath } from "url";

// 🔧 Naprawa braku __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // ⚠️ preload MUSI wskazywać na skompilowany plik JS, nie TS
      preload: path.join(__dirname, "preload.ts"),
    },
  });

  if (app.isPackaged) {
    if (appServe) {
      appServe(win).then(() => {
        win.loadURL("app://-");
      });
    }
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();

    win.webContents.on("did-fail-load", () => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
