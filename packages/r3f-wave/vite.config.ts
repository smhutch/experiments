import { defineConfig } from "vite";
import glslify from "rollup-plugin-glslify";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), glslify()],
});
