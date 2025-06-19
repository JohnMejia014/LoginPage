const { getDefaultConfig } = require("expo/metro-config");
console.log("✅ metro.config.js loaded");

const config = getDefaultConfig(__dirname);

// Allow ".cjs" extensions for Firebase and others
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes("cjs")) {
  config.resolver.sourceExts.push("cjs");
}

// Disable strict "exports" resolution for compatibility
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
