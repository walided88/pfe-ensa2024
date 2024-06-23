module.exports = {
    presets: ['module:metro-react-native-babel-preset', '@babel/preset-env', '@babel/preset-react'],

    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ['module:react-native-dotenv', {
        "moduleName": "@env",
        "path": ".env",
      }],
    ],
  };
  