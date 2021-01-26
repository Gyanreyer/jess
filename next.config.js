module.exports = {
  webpack: (cfg) => {
    cfg.module.rules.push({
      test: /\.yml$/,
      type: "json",
      use: "yaml-loader",
    });
    return cfg;
  },
  crossOrigin: "anonymous",
};
