module.exports = {
    printWidth: 100, 
    tabWidth: 2, 
    useTabs: false, // Use spaces instead of tabs
    semi: true, // Use semicolons for clarity
    singleQuote: true, // Prefer single quotes for JavaScript/JSX
    quoteProps: 'consistent', // Quote object properties only when necessary
    jsxSingleQuote: false, // Use double quotes in JSX for better compatibility
    trailingComma: 'all', // Add trailing commas for easier diffs
    bracketSpacing: true, // Add spaces inside object literals `{ foo: bar }`
    bracketSameLine: false, // JSX tags closing bracket on a new line
    arrowParens: 'always', // Always use parentheses for arrow functions
    endOfLine: 'lf', // Use LF for line endings (Linux/macOS compatibility)
  
    // Node.js & Express.js Specific
    overrides: [
      {
        files: ['*.config.js', '*.config.cjs', '*.config.mjs'],
        options: {
          printWidth: 80, // Keep configuration files more compact
        },
      },
      {
        files: ['*.js', '*.mjs', '*.cjs'],
        options: {
          parser: 'babel',
        },
      },
    ],
  
    // React.js Specific
    plugins: [], // Add necessary Prettier plugins if required
    overrides: [
      {
        files: ['*.jsx', '*.tsx'],
        options: {
          printWidth: 100, // Allow longer lines in JSX
          jsxSingleQuote: false, // Double quotes in JSX
          trailingComma: 'es5',
        },
      },
    ],
  
    // JSON & Markdown Formatting
    overrides: [
      {
        files: ['*.json', '.prettierrc'],
        options: {
          printWidth: 80,
        },
      },
      {
        files: ['*.md'],
        options: {
          proseWrap: 'always', // Wrap markdown text automatically
        },
      },
    ],
  
    // Special Handling
    embeddedLanguageFormatting: 'auto', // Automatically format embedded code
    htmlWhitespaceSensitivity: 'css', // Respect CSS display property in HTML
    vueIndentScriptAndStyle: false, // No extra indentation in Vue `<script>` and `<style>`
  };
  

// module.exports = {
//     arrowParens: "avoid",
//     bracketSameLine: true,
//     bracketSpacing: false,
//     singleQuote: true,
//     trailingComma: "all",
//     tabWidth: 5,
// };
