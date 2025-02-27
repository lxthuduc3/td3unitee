const pwaConfigs = {
  injectRegister: 'auto',
  registerType: 'autoUpdate',
  filename: 'firebase-messaging-sw.js',
  manifest: {
    name: 'TD3 Unitee',
    short_name: 'TD3 Unitee',
    description: 'The best app for Thu Duc 3 brothers',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
  },
}

export default pwaConfigs
