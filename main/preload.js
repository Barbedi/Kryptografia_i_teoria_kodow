"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
console.log("✅ Preload działa — rejestruję API!");
var api = {
    rust: {
        hello: function () {
            console.log("🚀 Wywołano api.rust.hello()");
            return electron_1.ipcRenderer.invoke("rust:hello");
        },
    },
    file: {
        test: function () {
            console.log("📂 Wywołano api.file.test()");
            return electron_1.ipcRenderer.invoke("file:test");
        },
    },
};
electron_1.contextBridge.exposeInMainWorld("api", api);
console.log("✅ API zostało wystawione na window.api");
