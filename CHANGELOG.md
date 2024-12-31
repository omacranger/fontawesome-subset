# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.5.0](https://github.com/omacranger/fontawesome-subset/compare/4.4.0...4.5.0)

-   Support FontAwesome 6.7.0+, including the new `sharp-duotone` and `duotone` variants

## [4.4.0](https://github.com/omacranger/fontawesome-subset/compare/4.3.1...4.4.0)

-   Support FontAwesome 6.4.0+, including the `sharp-light` and `sharp-regular` styles
-   Bump dependencies & dev dependencies

## [4.3.1](https://github.com/omacranger/fontawesome-subset/compare/4.3.0...4.3.1)

-   Update error / debug message when requested package cannot be resolved. Provide typical resolution if attempting to use pro features without specifying pro package in options.

## [4.3.0](https://github.com/omacranger/fontawesome-subset/compare/4.2.0...4.3.0)

-   Support FontAwesome 6.2.0+ including new `sharp-solid` subset
-   Add ability to locate icons based on their unicode value (for those using them in CSS), or any other aliases. Thanks to #23 for starting this effort

## [4.2.0](https://github.com/omacranger/fontawesome-subset/compare/4.1.0...4.2.0)

-   Re-add support for `woff` file formats, and allow customizing exported fonts via `targetFormats` option.

## [4.1.0](https://github.com/omacranger/fontawesome-subset/compare/4.0.0...4.1.0)

-   Add support for `thin` font subset ( #23 )
-   Add better / additional logging information for invalid subset & icon combos
-   Return promise from `fontawesomeSubset` to listen for success status

## [4.0.0](https://github.com/omacranger/fontawesome-subset/compare/3.0.0...4.0.0)

-   Update minimum FontAwesome NPM dependencies to >=5.12.0.
-   Upgrade parsing system to use icon metadata YAML instead of parsing SVGs. This also fixes FontAwesome 6.0 support ( Resolves #15 & #16 )
-   Replace manual usage of node_modules with `require.resolve` ( Resolves #17 )

## [3.0.0](https://github.com/omacranger/fontawesome-subset/compare/2.0.0...3.0.0)

-   Update default export to be an object for better future maintainability & modern tooling. See [the upgrade guide](UPGRADING.md) for further details.
-   Update all dependencies to latest versions ( Resolves #13 )
-   Remove default timestamp on fonts to ensure deterministic output ( Resolves #11 )

## [2.0.0](https://github.com/omacranger/fontawesome-subset/compare/1.1.0...2.0.0)

-   Remove required `@fortawesome/fontawesome-free` dependency. Must install a needed version manually and define the package type in the options object. Defaults to `free`. See [the upgrade guide](UPGRADING.md) for further details.
-   Refactored module to TypeScript

## [1.1.0](https://github.com/omacranger/fontawesome-subset/compare/1.0.0...1.1.0)

### Added

-   Ability to generate optimized [Duotone](https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons) icons by supplying the `duotone` key to the subset option. See readme for full usage details.

### Fixed

-   Resolved issue with `.eot` / `.woff` file generation for IE / older browsers.

## [1.0.0](https://github.com/omacranger/fontawesome-subset/releases/tag/1.0.0)

Initial release on Github and version which was published to NPM as 0.1.0. Updated to semver.

### Added

-   Ability to generate subsets for FontAwesome based on a supplied list of icon / glyph names
-   Includes support for FontAwesome Pro & Free versions
