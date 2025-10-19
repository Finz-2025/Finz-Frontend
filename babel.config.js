module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          '~assets': './assets',
        },
        extensions: ['.tsx', '.ts', '.js', '.json'],
      },
    ],
  ],
};
