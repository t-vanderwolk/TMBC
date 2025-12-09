const path = require("path");

module.exports = {
  webpack: (config) => {
    const shims = [
      ["es-errors/ref", "es-errors-ref.js"],
      ["es-errors/syntax", "es-errors-syntax.js"],
      ["es-errors/uri", "es-errors-uri.js"],
      ["es-errors/eval", "es-errors-eval.js"],
      ["es-errors/range", "es-errors-range.js"],
      ["es-errors/type", "es-errors-type.js"],
    ];

    config.resolve.alias = config.resolve.alias || {};
    shims.forEach(([pkg, file]) => {
      config.resolve.alias[pkg] = path.resolve(__dirname, `lib/shims/${file}`);
    });

    return config;
  },
};
