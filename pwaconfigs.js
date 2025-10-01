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
    name: 'TD3 Unitee',
    short_name: 'TD3 Unitee',
    description: 'The best app for Thu Duc 3 brothers',
    start_url: '/',
    scope: '/',
    lang: 'vi',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#000000',
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
