// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require("@smartive-education/design-system-component-library-team-ost/tailwind-config"),
  ],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@smartive-education/design-system-component-library-team-ost/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
