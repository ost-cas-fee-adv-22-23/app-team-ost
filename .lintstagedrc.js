const path = require('path');

const buildPrettierCommand = (filenames) =>
  `prettier --write --config ./.prettierrc ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;

// We removed the --fix param, to see error/warnings.
const buildEslintCommand = (filenames) =>
  `next lint --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx,css,md,json}': [buildPrettierCommand],
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};
