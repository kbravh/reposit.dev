// @ts-check
/** @type {import('lint-staged').Configuration} */
const config = {
  '!(*.{js,jsx,ts,tsx})': 'prettier --write',
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
};

export default config;
