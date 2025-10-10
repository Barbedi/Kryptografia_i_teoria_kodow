import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (channel: string, callback: (event: IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(channel, callback);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (channel: string, args?: any) => {
    ipcRenderer.send(channel, args);
  }
});
