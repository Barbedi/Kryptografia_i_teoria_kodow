import { app, BrowserWindow, ipcMain, dialog } from "electron";
import serve from "electron-serve";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import fs from "fs/promises";

const require = createRequire(import.meta.url);
const rust = require("../rust_module/index.node");

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
    return rust.encryptCezar(text, shift);
  });

  ipcMain.handle("rust:decryptCezar", (_event, text: string, shift: number) => {
    return rust.decryptCezar(text, shift);
  });
  ipcMain.handle(
    "rust:encryptVigenere",
    (_event, text: string, key: string) => {
      return rust.encryptVigenere(text, key);
    },
  );
  ipcMain.handle(
    "rust:decryptVigenere",
    (_event, text: string, key: string) => {
      return rust.decryptVigenere(text, key);
    },
  );
  ipcMain.handle(
    "rust:encrypt_running_key",
    (_event, text: string, key: string) => {
      return rust.encryptRunningKey(text, key);
    },
  );
  ipcMain.handle(
    "rust:decrypt_running_key",
    (_event, text: string, key: string) => {
      return rust.decryptRunningKey(text, key);
    },
  );
  ipcMain.handle("rust:encrypt_aes", (_event, text: string, key: string) => {
    return rust.encryptAes(text, key);
  });
  ipcMain.handle("rust:decrypt_aes", (_event, text: string, key: string) => {
    return rust.decryptAes(text, key);
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
