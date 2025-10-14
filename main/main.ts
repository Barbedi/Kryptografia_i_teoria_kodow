import { app, BrowserWindow, ipcMain, dialog } from "electron";
import serve from "electron-serve";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import fs from "fs/promises";

const require = createRequire(import.meta.url);
console.log("🦀 Ładuję moduł Rust...");
const rust = require("../rust_module/index.node");
console.log("✅ Rust module załadowany:", Object.keys(rust));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appServe = app.isPackaged
  ? serve({ directory: path.join(__dirname, "../out") })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), 
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    appServe?.(win).then(() => win.loadURL("app://-"));
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", () => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.whenReady().then(() => {
  console.log("🔧 Rejestracja IPC handlerów...");

  ipcMain.handle("file:open", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Wybierz plik do szyfrowania",
      filters: [{ name: "Pliki tekstowe", extensions: ["txt"] }],
      properties: ["openFile"],
    });

    if (canceled || filePaths.length === 0) return null;

    const path = filePaths[0];
    const content = await fs.readFile(path, "utf-8");
    return { path, content };
  });

  ipcMain.handle("rust:encryptCezar", (_event, text: string, shift: number) => {
    console.log("⚙️ Wywołano rust.encryptCezar");
    return rust.encryptCezar(text, shift);
  });

  ipcMain.handle("rust:decryptCezar", (_event, text: string, shift: number) => {
    console.log("⚙️ Wywołano rust.decryptCezar");
    return rust.decryptCezar(text, shift);
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
