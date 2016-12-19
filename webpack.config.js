module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: './target',
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  externals: [
    {'react': true}
  ],
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel'}
    ]
  }
};
