module.exports =  {
    test: /\.html$/,
    exclude: /node_modules/,
    use: [{
        loader: 'html-loader'
    }]

};
  