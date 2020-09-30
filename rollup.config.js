import wasm from '@rollup/plugin-wasm';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';

const prod = !process.env.ROLLUP_WATCH
const dev = !!process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },
  plugins: [
    html(), 
    wasm(),
    dev && serve('dist'),
    svelte(),
    resolve({
			browser: true,
			dedupe: ['svelte']
		}),
  ],
};