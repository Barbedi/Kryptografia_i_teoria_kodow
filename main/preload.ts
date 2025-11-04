import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  file: {
    open: () => ipcRenderer.invoke("file:open"),
  },
  rust: {
    encryptCezar: (text: string, shift: number) =>
      ipcRenderer.invoke("rust:encryptCezar", text, shift),
    decryptCezar: (text: string, shift: number) =>
      ipcRenderer.invoke("rust:decryptCezar", text, shift),
    encryptVigenere: (text: string, key: string) =>
      ipcRenderer.invoke("rust:encryptVigenere", text, key),
    decryptVigenere: (text: string, key: string) =>
      ipcRenderer.invoke("rust:decryptVigenere", text, key),
    encrypt_running_key: (text: string, key: string) =>
      ipcRenderer.invoke("rust:encrypt_running_key", text, key),
    decrypt_running_key: (text: string, key: string) =>
      ipcRenderer.invoke("rust:decrypt_running_key", text, key),
    encrypt_aes: (text: string, key: string) =>
      ipcRenderer.invoke("rust:encrypt_aes", text, key),
    decrypt_aes: (text: string, key: string) =>
      ipcRenderer.invoke("rust:decrypt_aes", text, key),
  },
});
