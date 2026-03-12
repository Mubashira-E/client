import antfu from "@antfu/eslint-config";
import nextPlugin from "@next/eslint-plugin-next";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default antfu(
  {
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },
    react: true,
    typescript: {
      overrides: {
        "ts/consistent-type-definitions": ["error", "type"],
      },
    },
    ignores: [
      "**/*.md",
      "**/*.yml",
      "**/*.yaml",
      "**/*.json",
      "**/*.toml",
      "**/specs/**",
      "**/docs/**",
      "**/.github/**",
      "**/CLAUDE.md",
      "**/public/**",
    ],
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...pluginQuery.configs["flat/recommended"].rules,
      "no-restricted-globals": "off",
      "node/prefer-global/process": "off",
    },
  },
);
