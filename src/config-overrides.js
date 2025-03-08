module.exports = function override(config) {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    config.resolve.fallback = {
      process: false,
    };
    return config;
  };