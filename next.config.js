/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const moduleExports = withBundleAnalyzer({
  reactStrictMode: true,
})


module.exports = moduleExports;
