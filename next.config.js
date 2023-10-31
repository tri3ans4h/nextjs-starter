/** @type {import('next').NextConfig} */
//const { i18n } = require("./next-i18next.config");
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['utfs.io', 'res.cloudinary.com', "images.pexels.com", "localhost", "192.168.1.6", "source.unsplash.com"],
    },
    //i18n
}

module.exports = nextConfig
