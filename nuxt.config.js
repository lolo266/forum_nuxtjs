//const webpack = require('webpack');
const config = require('./app.config.js');
const URL = !(process.env.NODE_ENV === 'production') ? '' : config.URL;

module.exports = {
  mode: 'universal',
  //Head
  head: {
    title: 'Project',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1'},
      { hid: 'description', name: 'description', content: 'Project' },
    ],
    noscript: [{ innerHTML: 'Vui lòng bật Javascript và tải lại trang' }],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },
  //Render
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      },
    },
  },
  //Style
  loading: {
    color: '#1976d2',
  },
  css: [
    '~/assets/style.scss',
  ],
  //Router
  router: {
    middleware: ['auth']
  },
  //Plugins
  plugins: [
    {src: '~/plugins/vue-notification', mode: 'client'},
    {src: '~/plugins/dayjs'},
    {src: '~/plugins/compoment'},
    {src: '~/plugins/lazy-image'},
    {src: '~/plugins/vue-editor', mode: 'client'}
  ],
  //Vuetify
  buildModules: ['@nuxtjs/vuetify'],
  vuetify: {
    treeShake: true,
    defaultAssets: {
      font: {
        family: 'Quicksand' 
      },
      icons: ['md']
    },
    optionsPath: './vuetify.options.js'
  },
  //Modules
  modules: [
    '@nuxtjs/axios', 
    ['@nuxtjs/html-minifier', { log: 'once'}], 
    ['@nuxtjs/pwa', { icon: false }]
  ],
  pwa: {
    manifest: {
      short_name: "Project",
      name: "Project",
      display: 'fullscreen',
      theme_color: "#242526",
      background_color: "#242526",
      categories: ["forum", "nuxtjs", "vuejs", "nodejs"],
      start_url: '/forum',
      icons: [
        {
          "src": "/icon.png",
          "type": "image/png",
          "sizes": "72x72 96x96 128x128 192x192 256x256"
        }
      ]
    }
  },
  //Axios
  axios: {
    baseURL: URL+'/api',
  },
  //Build
  build: {
    capche: true,
    optimizeCSS: true,
    plugins: [
    ],
    extend (config, ctx) {
    },
  }
}
