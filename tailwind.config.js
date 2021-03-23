module.exports = {
  purge: ['./src/**/*.svelte'],
  theme: {
    extend: {},
    // screens: {} // custom breakpoints
  },
  variants: {
    // backgroundColor: [ 'responsive', 'hover', 'focus', 'active']
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
};
