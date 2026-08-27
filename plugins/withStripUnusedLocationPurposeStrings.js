const { withInfoPlist } = require("expo/config-plugins");

// expo-location's own config plugin (plugin/build/withLocation.js) always
// writes FOUR Info.plist keys — NSLocationWhenInUseUsageDescription,
// NSLocationAlwaysAndWhenInUseUsageDescription, NSLocationAlwaysUsageDescription,
// NSMotionUsageDescription — falling back to its generic boilerplate
// ("Allow $(PRODUCT_NAME) to access your location") for any of the three
// this app.json doesn't configure. This app only ever calls
// requestForegroundPermissionsAsync() (see src/lib/location.ts) — it never
// requests Always-location or motion access — so those three vague,
// unused strings were shipping in every build. That's exactly the class of
// purpose string Apple's 5.1.1(ii) rejection called out (see
// review-note.txt), just on keys the reviewer didn't happen to trigger
// this time. Config-plugin mods run in REVERSE registration order (each
// later plugin becomes the outer wrapper, so its action runs first and
// delegates inward — see @expo/config-plugins' withMod/withBaseMod), so
// this has to be registered BEFORE expo-location in app.json's plugins
// array for expo-location's additions to still be there, unstripped, when
// this one's deletions actually need to run.
module.exports = function withStripUnusedLocationPurposeStrings(config) {
  return withInfoPlist(config, (config) => {
    delete config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription;
    delete config.modResults.NSLocationAlwaysUsageDescription;
    delete config.modResults.NSMotionUsageDescription;
    return config;
  });
};
