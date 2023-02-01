const path = require("path");

// We removed the --fix param, to see error/warnings.
const buildEslintCommand = (filenames) =>
  `next lint --max-warnings=0 --ext js --ext ts --ext jsx --ext tsx --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
};
