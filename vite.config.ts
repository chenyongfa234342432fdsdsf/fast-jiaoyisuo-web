// https://vitejs.dev/config/
import { defineConfig, loadEnv, UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import legacy from '@vitejs/plugin-legacy'
import ssr from 'vite-plugin-ssr/plugin'
import macrosPlugin from 'vite-plugin-babel-macros'
import postcssPresetEnv from 'postcss-preset-env'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import vavite from 'vavite'
import { injectEnvConfig } from './build'
// import ViteFontmin from 'vite-fontmin'

// import { visualizer } from 'rollup-plugin-visualizer'

// Packages we want in the vendor aka the deps needed in the entire app.
// const globalVendorPackages = ['react', 'react-dom', 'react-router-dom', '@nbit/arco']

// function renderChunks(deps: Record<string, string>) {
//   let chunks = {}
//   Object.keys(deps).forEach(key => {
//     if (globalVendorPackages.includes(key)) return
//     chunks[key] = [key]
//   })
//   return chunks
// }
process.env.VITE_MARKCOIN_BUSINESS_ID = process.env.VITE_MARKCOIN_BUSINESS_ID || '120057'
const id = process.env.VITE_MARKCOIN_BUSINESS_ID
export default async ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_PORT, VITE_NEWBIT_ENV } = env
  await injectEnvConfig(env, mode, id)
  const enabledSentry = ['dev', 'test', 'production'].includes(VITE_NEWBIT_ENV || '')
  const enabledSourceMap = ['dev', 'test'].includes(VITE_NEWBIT_ENV || '')
  return defineConfig({
    legacy: { buildSsrCjsExternalHeuristics: true },
    server: {
      port: Number(VITE_PORT),
      host: 'localhost',
    },
    buildSteps: [
      { name: 'client' },
      {
        name: 'server',
        config: {
          build: {
            ssr: true,
            rollupOptions: {
              output: {
                // We have to disable this for multiple entries
                inlineDynamicImports: false,
              },
            },
          },
        },
      },
    ],
    plugins: [
      enabledSentry
        ? sentryVitePlugin({
            org: 'newbit',
            project: 'newbit-web',
            include: './dist',
            authToken: 'd247ef4d9ba344fab67085856a6b5cdca83c24ff42f34a3eb2ab6b0cbd0eebde',
          })
        : {},
      vavite({
        serverEntry: '/server/index.ts',
        serveClientAssetsInDev: true,
      }),
      tsconfigPaths(),
      macrosPlugin(),
      legacy({
        renderLegacyChunks: false,
      }),
      postcssPresetEnv(),
      react(),
      createStyleImportPlugin({
        libs: [
          {
            libraryNameChangeCase: 'pascalCase',
            libraryName: '@nbit/arco',
            esModule: true,
            resolveStyle: name => {
              return `@nbit/arco/es/${name}/style/css.js`
            },
          },
        ],
      }),
      // ViteFontmin({
      //   fontSrc: './src/assets/font/**/*.*',
      //   fontDest: './public/font',
      //   fileExt: ['ts'],
      //   include: 'src/locales/**/*',
      // }),
      ssr({ disableAutoFullBuild: true }),
      // visualizer(),
    ],
    build: {
      target: 'es2020',
      outDir: './dist',
      sourcemap: enabledSourceMap,
      // rollupOptions: {
      //   output: {
      //     manualChunks: {
      //       vendor: globalVendorPackages,
      //       ...renderChunks(dependencies),
      //     },
      //   },
      // },
    },
    css: {
      modules: {
        generateScopedName: '[folder]-[name]__[local]--[hash:base64:3]',
        scopeBehaviour: 'global',
      },
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
    },
  } as UserConfig)
}
