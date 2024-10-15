   // vite.config.js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
    publicDir: 'static',
    //  root: '',
     server: {
       port: 8000, // You can specify the port here
     },
    //  resolve: {
    //    alias: {
    //      $components: '/src/components',
    //      $assets: '/src/assets',
    //      $styles: '/src/styles',
    //      $utils: '/src/utils',
    //      $types: '/src/types',
    //      $hooks: '/src/hooks',
    //      $contexts: '/src/contexts',
    //    }
    // } 
     
   })

  //  mexico +london  + japan were fun -> (__inpso__, )