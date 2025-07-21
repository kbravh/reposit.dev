// @ts-check
/** @type {import('lint-staged').Config} */
const config = {
  '!(*.{js,jsx,ts,tsx})': 'prettier --write',
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
};

export default config;
