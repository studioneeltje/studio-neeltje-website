import {defineConfig}from'vite';
export default defineConfig({base:'./',build:{outDir:'dist',emptyOutDir:false,rollupOptions:{input:{beheer:'beheer/index.html',cms:'cms/index.html'}}}});
