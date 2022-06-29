# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0](https://github.com/omacranger/fontawesome-subset/compare/3.0.0...4.0.0)
- Update minimum FontAwesome NPM dependencies to >=5.12.0.
- Upgrade parsing system to use icon metadata YAML instead of parsing SVGs. This also fixes FontAwesome 6.0 support ( Resolves #15 & #16 )
- Replace manual usage of node_modules with `require.resolve` ( Resolves #17 )

## [3.0.0](https://github.com/omacranger/fontawesome-subset/compare/2.0.0...3.0.0)
- Update default export to be an object for better future maintainability & modern tooling. See [the upgrade guide](UPGRADING.md) for further details.
- Update all dependencies to latest versions ( Resolves #13 )
- Remove default timestamp on fonts to ensure deterministic output ( Resolves #11 )

## [2.0.0](https://github.com/omacranger/fontawesome-subset/compare/1.1.0...2.0.0)
- Remove required `@fortawesome/fontawesome-free` dependency. Must install a needed version manually and define the package type in the options object. Defaults to `free`. See [the upgrade guide](UPGRADING.md) for further details.
- Refactored module to TypeScript

## [1.1.0](https://github.com/omacranger/fontawesome-subset/compare/1.0.0...1.1.0)

### Added
- Ability to generate optimized [Duotone](https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons) icons by supplying the `duotone` key to the subset option. See readme for full usage details.

### Fixed
- Resolved issue with `.eot` / `.woff` file generation for IE / older browsers.

## [1.0.0](https://github.com/omacranger/fontawesome-subset/releases/tag/1.0.0)

Initial release on Github and version which was published to NPM as 0.1.0. Updated to semver.

### Added
- Ability to generate subsets for FontAwesome based on a supplied list of icon / glyph names
- Includes support for FontAwesome Pro & Free versions
