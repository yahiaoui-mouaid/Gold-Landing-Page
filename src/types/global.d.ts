export {};

declare global {
  interface Window {
    /** Timer set by the inline head script; cleared once the hero takes over the intro. */
    __introFailsafe?: number;
  }
}
