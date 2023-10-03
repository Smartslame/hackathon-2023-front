const axiosConfig = {
  proxyHeadersIgnore: ['cf-ray', 'cf-connecting-ip'],
  // baseUrl: process.env.API_URL,
  baseUrl: "https://localhost:8080/",
  browserBaseUrl: "https://localhost:8080/",
  credentials: false,
  proxy: true
}

const proxyfiedUrls = [
  '/api/**',
]


const config = {
  mode: 'spa',
  modules: [
    '@nuxtjs/axios',
  ],
  plugins: [
    { src: '~nuxt_plugins/SimplePlugins.js' },
  ],
  css: [
    'element-ui/lib/theme-chalk/index.css',
  ],
  axios: axiosConfig,
  proxy: process.env.NUXT_PROXY_ENABLED === 'true'
      ? proxyfiedUrls.map(ctx => [ctx, { target: process.env.PROXY_API_URL, autoRewrite: true }])
      : undefined,
publicRuntimeConfig: {
    'NODE_ENV': process.env.NODE_ENV
  },
}

console.log("CONFIG: ", config)

export default config
