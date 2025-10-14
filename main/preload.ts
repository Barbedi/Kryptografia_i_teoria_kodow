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
  },
});
