import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'matchmaking',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { src: 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js', defer: true },
      {
        src: 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js',
        defer: true
      },
      {
        src: 'https://unpkg.com/@vkontakte/superappkit@1.57.0/dist/index-umd.js',
        defer: true
      }
    ]
  },

  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    REDIRECT_URI: process.env.REDIRECT_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    VK_ID: process.env.VK_ID,

    BASE_API_URL: process.env.BASE_API_URL
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [], //'~/assets/scss/index.scss'

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/three.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/vuetify'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios'],

  axios: {
    baseURL: `${process.env.BASE_API_URL}`,
    headers: {
      common: {
        Accept: 'application/json'
      }
    }
  },

  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  server: {
    host: '0'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    standalone: true,
    extractCSS: false,
    filenames: {
      chunk: ({ isDev }) => (isDev ? '[name].js' : '[id].[contenthash].js')
    },
    optimization: {
      nodeEnv: 'production',
      runtimeChunk: 'single'
    },
    extend(config, ctx) {
      config.resolve.alias.three$ = 'three/build/three.module.js'

      if (config.module) {
        config.module.rules.push({
          test: /\.(glsl)$/i,
          use: ['raw-loader']
        })
      }
    }
  }
}
