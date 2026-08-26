const pwaConfigs = {
  injectRegister: 'auto',
  registerType: 'autoUpdate',
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.js',
  devOptions: {
    enabled: true,
    type: 'module',
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    maximumFileSizeToCacheInBytes: 3000000,
  },
  manifest: {
    name: 'TD Unitee',
    short_name: 'TD Unitee',
    description: 'The best app for Thu Duc brothers',
    start_url: '/',
    scope: '/',
    lang: 'vi',
    display: 'standalone',
    orientation: 'portrait',
    // Adaptive color-scheme form (https://github.com/w3c/manifest/pull/1042):
    // Chromium reads this and re-colors the OS status/nav bar to match
    // AppHeader/AppNavbar's actual rendered .glass-panel color in each theme
    // (not just the page's gradient backdrop) — no single fixed color.
    background_color: [
      { media: '(prefers-color-scheme: light)', color: '#fffdf6' },
      { media: '(prefers-color-scheme: dark)', color: '#140901' },
    ],
    theme_color: [
      { media: '(prefers-color-scheme: light)', color: '#fffdf6' },
      { media: '(prefers-color-scheme: dark)', color: '#140901' },
    ],
    categories: ['social', 'productivity'],
    icons: [
      {
        src: '/icon.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
}

export default pwaConfigs
