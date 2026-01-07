# Dumanless Mobile

## Remote quiz assets
- Quiz illustrations mirror the live web quiz and are pulled at runtime via `resolveAssetUri`, which converts relative paths (e.g. `/illustrations/age-01.svg`) into absolute `https://dumanless.com/...` URLs.
- `RemoteIllustration` renders those remote SVGs/PNGs with `react-native-svg` and shows a soft placeholder if loading fails, so no assets need to be bundled locally.
