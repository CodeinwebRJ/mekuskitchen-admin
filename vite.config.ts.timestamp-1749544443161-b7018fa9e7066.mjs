// vite.config.ts
import svgr from "file:///D:/mbinfoways/New%20Project/Mekus%20Kitchen/Meku's%20Kitchen%20Admin/node_modules/@svgr/rollup/dist/index.js";
import react from "file:///D:/mbinfoways/New%20Project/Mekus%20Kitchen/Meku's%20Kitchen%20Admin/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs/promises";
import { resolve } from "path";
import { defineConfig } from "file:///D:/mbinfoways/New%20Project/Mekus%20Kitchen/Meku's%20Kitchen%20Admin/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "D:\\mbinfoways\\New Project\\Mekus Kitchen\\Meku's Kitchen Admin";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      src: resolve(__vite_injected_original_dirname, "src")
    }
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.tsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "load-js-files-as-tsx",
          setup(build) {
            build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
              loader: "tsx",
              contents: await fs.readFile(args.path, "utf8")
            }));
          }
        }
      ]
    }
  },
  plugins: [svgr(), react()],
  base: "/MatDash"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxtYmluZm93YXlzXFxcXE5ldyBQcm9qZWN0XFxcXE1la3VzIEtpdGNoZW5cXFxcTWVrdSdzIEtpdGNoZW4gQWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXG1iaW5mb3dheXNcXFxcTmV3IFByb2plY3RcXFxcTWVrdXMgS2l0Y2hlblxcXFxNZWt1J3MgS2l0Y2hlbiBBZG1pblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovbWJpbmZvd2F5cy9OZXclMjBQcm9qZWN0L01la3VzJTIwS2l0Y2hlbi9NZWt1J3MlMjBLaXRjaGVuJTIwQWRtaW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgc3ZnciBmcm9tICdAc3Znci9yb2xsdXAnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMvcHJvbWlzZXMnO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBzcmM6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZXNidWlsZDoge1xyXG4gICAgbG9hZGVyOiAndHN4JyxcclxuICAgIGluY2x1ZGU6IC9zcmNcXC8uKlxcLnRzeD8kLyxcclxuICAgIGV4Y2x1ZGU6IFtdLFxyXG4gIH0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogJ2xvYWQtanMtZmlsZXMtYXMtdHN4JyxcclxuICAgICAgICAgIHNldHVwKGJ1aWxkKSB7XHJcbiAgICAgICAgICAgIGJ1aWxkLm9uTG9hZCh7IGZpbHRlcjogL3NyY1xcXFwuKlxcLmpzJC8gfSwgYXN5bmMgKGFyZ3MpID0+ICh7XHJcbiAgICAgICAgICAgICAgbG9hZGVyOiAndHN4JyxcclxuICAgICAgICAgICAgICBjb250ZW50czogYXdhaXQgZnMucmVhZEZpbGUoYXJncy5wYXRoLCAndXRmOCcpLFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIHBsdWdpbnM6IFtzdmdyKCksIHJlYWN0KCldLFxyXG4gIGJhc2U6ICcvTWF0RGFzaCcsXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdYLE9BQU8sVUFBVTtBQUN6WSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxRQUFRO0FBQ2YsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBSjdCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsSUFDVCxTQUFTLENBQUM7QUFBQSxFQUNaO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNLE9BQU87QUFDWCxrQkFBTSxPQUFPLEVBQUUsUUFBUSxlQUFlLEdBQUcsT0FBTyxVQUFVO0FBQUEsY0FDeEQsUUFBUTtBQUFBLGNBQ1IsVUFBVSxNQUFNLEdBQUcsU0FBUyxLQUFLLE1BQU0sTUFBTTtBQUFBLFlBQy9DLEVBQUU7QUFBQSxVQUNKO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFBQSxFQUN6QixNQUFNO0FBQ1IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
