// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  rules: [
    [/^bg-td-(.*)$/, ([, c]) => ({ backgroundColor: `var(--td-${c})` })],
    [/^color-td-(.*)$/, ([, c]) => ({ color: `var(--td-${c})` })],
  ],
})