const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/fr/admin/dashboard/utilisateurs',
          destination: '/fr/admin/dashboard/users',
          locale: false, // Use `locale: false` so that the prefix matches the desired locale correctly
        },
      ],
    }
  },
}
