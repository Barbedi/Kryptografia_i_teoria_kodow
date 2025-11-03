export {};

declare global {
  interface Window {
    api: {
      file: {
        open: () => Promise<{ path: string; content: string } | null>;
      };
      rust: {
        encryptCezar: (text: string, shift: number) => Promise<string>;
        decryptCezar: (text: string, shift: number) => Promise<string>;
        encryptVigenere: (text: string, key: string) => Promise<string>;
        decryptVigenere: (text: string, key: string) => Promise<string>;
        encrypt_running_key: (text: string, key: string) => Promise<string>;
        decrypt_running_key: (text: string, key: string) => Promise<string>;
        encrypt_aes: (text: string, key: string) => Promise<string>;
        decrypt_aes: (text: string, key: string) => Promise<string>;
      };
    };
  }
}
