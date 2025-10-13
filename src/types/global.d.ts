export {};

declare global {
  interface Window {
    api: {
      rust: {
        hello: () => Promise<string>;
      };
      file: {
        test: () => Promise<string>;
      };
    };
  }
}