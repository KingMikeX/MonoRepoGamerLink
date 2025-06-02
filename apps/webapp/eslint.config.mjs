// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Hier fügst du die Regeln hinzu, die du deaktivieren möchtest
    rules: {
      // Fehler, die du gemeldet hast, werden auf "off" gesetzt
      "@typescript-eslint/no-unused-vars": "off",         // Für 'upcomingTournaments', 'trendingGames', 'router', 'profileRes', 'Metadata', 'Clock', 'Calendar', 'Info', 'result', 'selectedPage', 'handleScrollTo'
      "no-var": "off",                                   // Für 'Unexpected var, use let or const instead'
      "@typescript-eslint/no-explicit-any": "off",       // Für 'Unexpected any. Specify a different type.'
      "react/no-unescaped-entities": "off",              // Für '`'` can be escaped with `&apos;` (wie in `user/profil/view/[user_id]/page.tsx`)

      // Optional: Next.js Bild-Warnungen auf "off" setzen, wenn sie stören (nicht Build-kritisch)
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;