({
  baseUrl: '../../',
  useStrict: true,
  optimize: 'none',
  paths: {
    'leaflet': 'node_modules/leaflet/dist/leaflet-src',
    'sulfur': 'src/sulfur',
    'text': 'node_modules/text/text',
    'unorm': 'node_modules/unorm/lib/unorm'
  },
  shim: {
    'unorm': { exports: 'unorm' }
  },
  name: 'app/widget/main',
  stubModules: [ 'text' ],
  out: 'main-built.js'
})
