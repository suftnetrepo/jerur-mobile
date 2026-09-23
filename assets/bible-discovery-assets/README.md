# Jerur Bible Discovery Asset Bundle

A consistent SVG illustration set for the Bible Discovery feature. The bundle contains 20 story cards, 5 collection banners, 6 achievement badges, and 3 decorative backgrounds.

## React Native / Expo

Install SVG support:

```bash
npx expo install react-native-svg
npm install --save-dev react-native-svg-transformer
```

Configure Metro to load SVG files as components, then import them:

```tsx
import DavidAndGoliath from '@/assets/bible-discovery/stories/david-and-goliath.svg';

<DavidAndGoliath width="100%" height={220} />
```

Alternatively render by URI with `SvgUri`. See `manifest.json` for stable IDs and paths.

## Theme guidance

The files use a shared palette. Keep card surfaces and typography theme-driven in React Native. For full runtime recolouring, convert frequently reused SVGs into `react-native-svg` components and pass theme colours as props.

## Accessibility

Every story and collection SVG includes a title and description. UI cards should still provide React Native `accessibilityLabel` values.

## Rights

These original symbolic illustrations were created for the Jerur application. They do not include third-party stock artwork, logos, or fonts.
