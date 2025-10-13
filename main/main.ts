import { app, BrowserWindow, ipcMain, dialog } from "electron";
import serve from "electron-serve";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import fs from "fs/promises";

const require = createRequire(import.meta.url);
console.log("🦀 Ładuję Rust module...");
const rust = require("../rust_module/index.node");
console.log("✅ Rust module załadowany:", Object.keys(rust));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appServe = app.isPackaged
  ? serve({ directory: path.join(__dirname, "../out") })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Skompilowany z preload.ts
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

// 📡 Rejestracja IPC dla Rust + testowego API
app.whenReady().then(() => {
  console.log("🔧 Registering IPC handlers...");

  // Rust API
  ipcMain.handle("rust:hello", () => {
    console.log("⚙️ Wywołano funkcję z Rust");
    try {
      const result = rust.helloWorld(); // dopasowane do eksportowanej funkcji
      console.log("✅ Rust funkcja zwróciła:", result);
      return result;
    } catch (error) {
      console.error("❌ Błąd przy wywołaniu Rust funkcji:", error);
      throw error;
    }
  });

  // Testowy handler do plików
  ipcMain.handle("file:test", async () => {
    console.log("📂 IPC file:test wywołany");
    return "🧩 Testowe API działa!";
  });

  ipcMain.handle("file:open", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Wybierz plik do szyfrowania",
      filters: [{ name: "Text Files", extensions: ["txt"] }],
      properties: ["openFile"],
    });

    if (canceled || filePaths.length === 0) return null;

    const path = filePaths[0];
    const content = await fs.readFile(path, "utf-8");

    return { path, content };
  });

  createWindow();
});

// 🔧 zamykanie aplikacji
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
