export {};

declare global {
  interface Window {
    api: {
      file: {
        open: () => Promise<{ path: string; content: string } | null>;
      };
      rust: {
        hello: () => Promise<string>;
      };
    };
  }
}
