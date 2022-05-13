const colors = require('tailwindcss/colors')

// mute warnings in dev:tailwind
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

module.exports = {
  mode: 'jit',
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
    maxWidth: {
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
    }
    // screens: {} // custom breakpoints
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
};
