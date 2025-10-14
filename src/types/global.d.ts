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
      };
    };
  }
}
