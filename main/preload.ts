import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  file: {
    open: () => ipcRenderer.invoke("file:open"),
  },
});
