/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/chat',
        destination: 'https://yongui-01d85530a217.herokuapp.com/chat',
      },
    ]
  },
}

module.exports = nextConfig 