module.exports = {
  babel: {
    plugins: [
      "@babel/plugin-syntax-import-attributes"
    ]
  },
  webpack: {
    configure: (webpackConfig) => {
      // 添加对 import attributes 的支持
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      });

      // 处理 ES 模块
      webpackConfig.module.rules.forEach(rule => {
        if (rule.oneOf) {
          rule.oneOf.forEach(oneOfRule => {
            if (oneOfRule.test && oneOfRule.test.toString().includes('js')) {
              oneOfRule.include = undefined;
              oneOfRule.exclude = /node_modules\/(?!(@wagmi|@base-org|viem))/;
            }
          });
        }
      });

      return webpackConfig;
    }
  }
};
