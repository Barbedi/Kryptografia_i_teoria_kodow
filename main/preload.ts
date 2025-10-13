import { contextBridge, ipcRenderer } from "electron";

console.log("✅ Preload działa — rejestruję API!");

const api = {
  rust: {
    hello: () => {
      console.log("🚀 Wywołano api.rust.hello()");
      return ipcRenderer.invoke("rust:hello");
    },
  },
  file: {
    test: () => {
      console.log("📂 Wywołano api.file.test()");
      return ipcRenderer.invoke("file:test");
    },
  },
};

contextBridge.exposeInMainWorld("api", api);
console.log("✅ API zostało wystawione na window.api");
