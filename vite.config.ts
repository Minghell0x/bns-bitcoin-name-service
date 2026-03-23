import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ['buffer', 'crypto', 'stream', 'util', 'process', 'events'],
      globals: { Buffer: true, global: true, process: true },
      overrides: { crypto: 'crypto-browserify' },
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      undici: 'opnet/browser',
    },
    dedupe: [
      '@noble/curves',
      '@noble/hashes',
      '@scure/base',
      'buffer',
      'react',
      'react-dom',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          opnet: ['opnet', '@btc-vision/bitcoin', '@btc-vision/transaction'],
        },
      },
    },
  },
})
