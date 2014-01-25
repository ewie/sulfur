({
  baseUrl: '../../',
  useStrict: true,
  optimize: 'none',
  paths: {
    'highlight': 'lib/highlight',
    'jszip': 'lib/jszip',
    'sulfur': 'src/sulfur',
    'text': 'node_modules/text/text',
    'unorm': 'node_modules/unorm/lib/unorm'
  },
  shim: {
    'unorm': { exports: 'UNorm' },
    'jszip': { exports: 'JSZip' }
  },
  name: 'app/editor/main',
  stubModules: [ 'text' ],
  out: 'main-built.js'
})
