// src/global.d.ts
export {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "gmpx-api-loader": any;
      "gmpx-place-picker": any;
    }
  }
}
