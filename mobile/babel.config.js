module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Required by Reanimated 4 - must stay last in the plugin list.
    plugins: ['react-native-worklets/plugin'],
  };
};
