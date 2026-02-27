declare module 'js-yaml' {
  export function load(source: string): unknown;
}

declare module 'liquid-glass-react' {
  import { ComponentType, ReactNode } from 'react';
  export const LiquidGlass: ComponentType<{ children?: ReactNode }>;
}
