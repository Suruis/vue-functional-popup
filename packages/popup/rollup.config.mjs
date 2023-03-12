import babel from '@rollup/plugin-babel'
import ts from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'
import pkg from './package.json' assert { type: 'json' }

export default [
  {
    input: `src/index.ts`,
    external: ['vue'],
    output: [
      {
        file: pkg.module,
        format: `es`,
      },
      {
        file: 'dist/vue-functional-popup.js',
        format: `cjs`,
      },
    ],
    plugins: [
      ts({
        tsconfig: './tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
          },
        },
      }),
      resolve(),
      babel({ babelHelpers: 'bundled', presets: ['@babel/env'] }),
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'dist/index.d.ts',
    output: {
      file: pkg.types,
      format: `es`,
    },
    plugins: [
      dts()
    ]
  }
]
