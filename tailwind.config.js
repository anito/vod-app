const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.svelte'],
  theme: {
    extend: {},
    colors: {
      ...colors,
      primary: 'var(--prime)',
      secondary: 'var(--second)',
      flash: 'var(--flash)',
      warning: 'var(--warning)',
      warning: {
        500: 'var(--warning-500)',
        400: 'var(--warning-400)',
        300: 'var(--warning-300)',
        200: 'var(--warning-200)',
        100: 'var(--warning-100)',
      },
    },
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
