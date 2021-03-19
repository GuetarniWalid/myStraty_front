const { override } = require('customize-cra');
const cspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

const cspConfigPolicy = {
  'script-src': ["'self'", 'https://js.stripe.com'],
  'style-src': ["'self'", 'https://use.fontawesome.com', 'https://fonts.googleapis.com'],
  'child-src': ['blob:', 'https://js.stripe.com'],
  'img-src': "'self'",
  'worker-src': 'blob:'
};

function addCspHtmlWebpackPlugin(config) {
  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(new cspHtmlWebpackPlugin(cspConfigPolicy));
  }

  return config;
}

module.exports = {
  webpack: override(addCspHtmlWebpackPlugin),
};
