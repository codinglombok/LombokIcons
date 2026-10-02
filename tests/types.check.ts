// Compile-time check of the published declarations (tsc --noEmit).
import { renderIcon, renderIconData, lfHome, icons, type IconData, type RenderOptions } from '../dist/js/lombokicons.mjs'

const opts: RenderOptions = { mode: 'duo', size: '2rem', class: 'x', color: '#000', title: 'Home' }
const a: string = renderIcon('home', opts)
const b: string = renderIconData(lfHome)
const c: IconData = icons['home']
// @ts-expect-error mode must be line, bold or duo
renderIcon('home', { mode: 'thin' })
void [a, b, c]
