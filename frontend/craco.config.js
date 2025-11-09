// Load configuration from environment or config file
const path = require('path');

// Environment variable overrides
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === 'true',
};

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig, { env }) => {
      
      // Production optimizations
      if (env === 'production') {
        // Enhanced optimization settings
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          minimize: true,
          usedExports: true,
          sideEffects: true,
          providedExports: true,
          // Better chunk splitting strategy
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: 25,
            maxAsyncRequests: 25,
            cacheGroups: {
              // Vendor chunk for node_modules
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                  return `vendor.${packageName.replace('@', '')}`;
                },
                priority: 10,
                reuseExistingChunk: true,
              },
              // Common shared code
              common: {
                minChunks: 2,
                priority: 5,
                reuseExistingChunk: true,
                enforce: true,
              },
              // React/React-DOM separate chunk
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'vendor.react',
                priority: 20,
                reuseExistingChunk: true,
              },
            },
          },
        };
        
        // Ultra-aggressive Terser optimization
        if (webpackConfig.optimization.minimizer) {
          webpackConfig.optimization.minimizer.forEach((minimizer) => {
            if (minimizer.constructor.name === 'TerserPlugin') {
              minimizer.options.terserOptions = {
                ...minimizer.options.terserOptions,
                compress: {
                  ...minimizer.options.terserOptions?.compress,
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
                  passes: 2, // Múltiplas passadas para compressão máxima
                  unsafe_math: true,
                  unsafe_methods: true,
                  unsafe_proto: true,
                  unsafe_regexp: true,
                  unsafe_undefined: true,
                  dead_code: true,
                  conditionals: true,
                  evaluate: true,
                  booleans: true,
                  loops: true,
                  unused: true,
                  hoist_funs: true,
                  hoist_props: true,
                  hoist_vars: false,
                  if_return: true,
                  join_vars: true,
                  reduce_vars: true,
                  reduce_funcs: true,
                },
                mangle: {
                  safari10: true,
                  toplevel: true,
                },
                format: {
                  comments: false,
                },
              };
              minimizer.options.extractComments = false;
            }
          });
        }
      }
      
      // Disable hot reload completely if environment variable is set
      if (config.disableHotReload) {
        // Remove hot reload related plugins
        webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
          return !(plugin.constructor.name === 'HotModuleReplacementPlugin');
        });
        
        // Disable watch mode
        webpackConfig.watch = false;
        webpackConfig.watchOptions = {
          ignored: /.*/, // Ignore all files
        };
      } else {
        // Add ignored patterns to reduce watched directories
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
          ],
        };
      }
      
      return webpackConfig;
    },
  },
};