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
    generateRSAKeys: () => ipcRenderer.invoke("rust:generateRSAKeys"),
    encryptRSA: (message: string, n: string, e: string) =>
      ipcRenderer.invoke("rust:encryptRSA", message, n, e),
    decryptRSA: (cipher: string, n: string, d: string) =>
      ipcRenderer.invoke("rust:decryptRSA", cipher, n, d),
    ecdhGeneratePrivateKey: () =>
      ipcRenderer.invoke("rust:ecdhGeneratePrivateKey"),
    ecdhGetPublicKey: (privateKey: string) =>
      ipcRenderer.invoke("rust:ecdhGetPublicKey", privateKey),
    ecdhComputeSharedSecret: (myPrivateKey: string, peerPublicKey: string) =>
      ipcRenderer.invoke("rust:ecdhComputeSharedSecret", myPrivateKey, peerPublicKey),
    ecdhDeriveKeySha256: (sharedSecret: string) =>
      ipcRenderer.invoke("rust:ecdhDeriveKeySha256", sharedSecret),
  },
});
