export default function(options = {}) {
  const {
    useModules = false,
    stage = 2,
    addReactOptimization = false,
  } = options

  const es2015preset = useModules ? 'es2015' : ['es2015', {modules: false}]

  // const plugins = [
  //   'add-module-exports',
  //   'syntax-dynamic-import',
  // ]

  const envPreset = ['env', {
    targets: {
      browsers: {
        chrome: 52
      }
    },
    loose: true,
    modules: useModules,
    debug: true,
    "useBuiltIns": true,
  }]

  return {
    presets: [
      'react',
      // es2015preset,
      // `stage-${stage}`,
      envPreset,
    ],
    plugins: [
      // 'add-module-exports',
      'transform-runtime',
      // ...(addReactOptimization ? ['transform-react-constant-elements', 'transform-react-inline-elements'] : []),
      'syntax-dynamic-import',
      // ["transform-object-rest-spread",{"useBuiltIns": true}],
      "transform-class-properties",
      // "transform-export-extensions",
    ]
  }
}