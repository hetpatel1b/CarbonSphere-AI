import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  { ignores: [".next/**", "node_modules/**", "coverage/**", "playwright-report/**"] }
];

export default eslintConfig;
