import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import sveltePreprocess from "svelte-preprocess";

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
  (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);
const aliases = () => ({
	resolve: ['.svelte', '.js', '.scss', '.css']
});
const postcssOptions = () => {
	return {
		config: {
			path: "./postcss.config.js",
		},
		extensions: ['.scss', '.sass'],
		extract: false,
		minimize: true,
		use: [
			['sass', {
				includePaths: [
					'./src/theme',
					'./node_modules'
				],
			}]
		]
	}
};

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      alias(aliases()),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: false,
        css: true,
        preprocess: sveltePreprocess(),
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      postcss(postcssOptions()),

      legacy &&
        babel({
          extensions: [".js", ".mjs", ".html", ".svelte"],
          babelHelpers: "runtime",
          exclude: ["node_modules/@babel/**"],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead",
              },
            ],
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-transform-runtime",
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      alias(aliases()),
      replace({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      svelte({
        generate: "ssr",
        dev,
        preprocess: sveltePreprocess(),
      }),
      resolve({
        dedupe: ["svelte"],
      }),
      commonjs(),
      postcss(postcssOptions()),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules ||
        Object.keys(process.binding("natives"))
    ),

    preserveEntrySignatures: "strict",
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      commonjs(),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
};
