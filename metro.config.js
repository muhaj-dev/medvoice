const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Point NativeWind v5 at the global CSS file so Tailwind v4 processes
// @theme tokens and @utility classes correctly.
module.exports = withNativewind(config, { input: "./global.css" });
