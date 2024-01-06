import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';

const name = 'index';
const outputFormats = [
  {
    file: `dist/${name}.js`,
    format: 'es',
  },
  {
    file: `dist/${name}.cjs`,
    format: 'cjs',
  },
];

export default [
  ...outputFormats.map(output => {
    return {
      input: 'src/index.ts',
      output,
      external: [
        'events',
        'stream',
        'serialport',
      ],
      plugins: [
        typescript({
          exclude: [
            '**/examples',
          ],
        }),
        terser(),
      ],
    };
  }),

  {
    input: 'dist/dts/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    external: ['events'],
    plugins: [
      dts(),
    ],
  },
];