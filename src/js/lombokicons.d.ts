/** Path data of one icon (SVG path syntax on a 24 x 24 view box). */
export interface IconData {
  readonly name: string
  readonly line: string
  readonly bold_accent: string | null
  readonly duo_accent: string | null
}

export type IconMode = 'line' | 'bold' | 'duo'

export interface RenderOptions {
  /** Rendering mode (default 'line'; unknown values fall back to 'line'). */
  mode?: IconMode
  /** CSS length such as '24px', '1.5rem' or '2em'; other values are ignored. */
  size?: string
  /** Extra CSS classes (escaped). */
  class?: string
  /** CSS colour such as '#e53e3e', 'teal', 'rgb(0 0 0)' or 'var(--brand)'; other values are ignored. */
  color?: string
  /** Accessible name; without it the icon is decorative (aria-hidden). */
  title?: string
}

export declare const icons: Readonly<Record<string, IconData>>
export declare const categoryMap: Readonly<Record<string, readonly string[]>>
export declare const count: number
export declare const version: string

export declare function renderIcon(name: string, opts?: RenderOptions): string
export declare function renderIconData(icon: IconData, opts?: RenderOptions): string
export declare function replaceIcons(root?: ParentNode | null, mode?: IconMode): void
export declare function escapeAttr(value: string): string
export declare function isValidSize(value: unknown): boolean
export declare function isValidColor(value: unknown): boolean
