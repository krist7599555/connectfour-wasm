import wasm from '@rollup/plugin-wasm';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import sveltePreprocess from 'svelte-preprocess';

const prod = !process.env.ROLLUP_WATCH
const dev = !!process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    sourcemap: false,
    format: 'iife',
    // preserveModules: true,
		name: 'app',
		file: 'public/build/bundle.js'
  },
  plugins: [
    wasm({
      publicPath: '/build/'
    }),
    svelte({
      dev: dev,
			css: css => {
				css.write('bundle.css');
      },
			preprocess: sveltePreprocess({
        postcss: {
          // syntax: 'postcss-scss',
          plugins: [
            require("tailwindcss"),
            require('autoprefixer'),
          ]
        },
        scss: true,
        typescript: true,
        sourceMap: false
			}),
    }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs({
      sourceMap: true
    }),
    // typescript({
    //   sourceMap: dev,
    //   inlineSources: dev
    // }),
    dev && serve('public'),
    // html(), 
  ],
};