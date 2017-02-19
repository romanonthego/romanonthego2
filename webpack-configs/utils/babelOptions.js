export default function(options = {}) {
  const {
    useModules = false,
    stage = 2,
    addReactOptimization = true,
  } = options

  const es2015preset = useModules ? 'es2015' : ['es2015', {modules: false}],

  const plugins = [
    'add-module-exports',
    'syntax-dynamic-import',
  ]

  return {
    presets: [
      'react',
      es2015preset,
      `stage-${stage}`,
    ],
    plugins: [
      'add-module-exports',
      ...(addReactOptimization ? ['transform-react-constant-elements', 'transform-react-inline-elements'] : []),
      'syntax-dynamic-import',
    ]
  },
}