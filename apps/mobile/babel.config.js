// Expo SDK 52 + NativeWind v4 babel pipeline.
//
// We inline NativeWind's preset (normally `nativewind/babel`) so we can OMIT the
// `react-native-worklets/plugin` line that react-native-css-interop@0.2.5 hard-codes
// for Reanimated 4. We use neither Reanimated 4 nor worklets, and that package is
// not installed — including it breaks the web/native bundle. This preset is
// otherwise identical to react-native-css-interop/babel.
function nativewindPreset() {
  return {
    plugins: [
      require('react-native-css-interop/dist/babel-plugin').default,
      [
        '@babel/plugin-transform-react-jsx',
        { runtime: 'automatic', importSource: 'react-native-css-interop' },
      ],
    ],
  };
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind', reanimated: false }],
      nativewindPreset,
    ],
    plugins: [],
  };
};
