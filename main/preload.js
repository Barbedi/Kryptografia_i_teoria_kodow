"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("api", {
  file: {
    open: function () {
      return electron_1.ipcRenderer.invoke("file:open");
    },
  },
  rust: {
    encryptCezar: function (text, shift) {
      return electron_1.ipcRenderer.invoke("rust:encryptCezar", text, shift);
    },
    decryptCezar: function (text, shift) {
      return electron_1.ipcRenderer.invoke("rust:decryptCezar", text, shift);
    },
    encryptVigenere: function (text, key) {
      return electron_1.ipcRenderer.invoke("rust:encryptVigenere", text, key);
    },
    decryptVigenere: function (text, key) {
      return electron_1.ipcRenderer.invoke("rust:decryptVigenere", text, key);
    },
    encrypt_running_key: function (text, key) {
      return electron_1.ipcRenderer.invoke(
        "rust:encrypt_running_key",
        text,
        key,
      );
    },
    decrypt_running_key: function (text, key) {
      return electron_1.ipcRenderer.invoke(
        "rust:decrypt_running_key",
        text,
        key,
      );
    },
  },
});
