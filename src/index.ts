/**
 * Author: Logan Graham <loganparkergraham@gmail.com>
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { mkdirp } from "mkdirp";
import {
    FAFamilyMetaType,
    FAIconType,
    FontAwesomeOptions,
    IconFamilyYAML,
    IconYAML,
    Subset,
    SubsetOption,
} from "./types";
import subsetFont from "subset-font";
import yaml from "yaml";
import { addIconError, findIconByName, iconHasStyle } from "./utils";
import { OUTPUT_FORMAT_MAP, STYLE_FONT_MAP } from "./constants";

/**
 * This function will take an object of glyph names and output a subset of the standard fonts optimized in size for
 * use on websites / external resources.
 *
 * @param subset Array or Object containing glyph / font family names.
 * @param outputDir Directory output generated webfonts.
 * @param options Object of options / tweaks for further customization. Defaults to 'Free' package.
 */
function fontawesomeSubset(
    subset: SubsetOption,
    outputDir: string,
    options: FontAwesomeOptions = {}
) {
    const { package: packageType = "free", targetFormats = ["woff2", "sfnt"] } = options;
    // Maps style to actual font name / file name.
    const fontTypes = Object.keys(STYLE_FONT_MAP);

    let packagePath;
    if(options.packagepath) {
       packagePath = options.packagepath;
    }
    else{
        packagePath = `@fortawesome/fontawesome-${packageType}`; 
    }

    let packageLocation;
    // Check to see if the user has either free, or pro installed.
    try {
        packageLocation = require.resolve(packagePath);
    }
    catch (e) {
        console.error(`Unable to resolve the module '${packagePath}'. Double-check that you have your preferred fontawesome package installed as a dependency and the package type passed into the options if using Pro features.\n\n\`fontawesomeSubset(..., ..., { package: 'pro' })\``);
        return Promise.resolve(false);
    }

    // Check that we have at least one target format for output
    if (!Array.isArray(targetFormats) || targetFormats.length === 0) {
        console.error("One or more target formats are required. Exiting.");

        return Promise.resolve(false);
    }

    const fontMeta = resolve(packageLocation, "../../metadata/icons.yml");
    const fontFamilyMeta = resolve(packageLocation, "../../metadata/icon-families.yml");
    const fontFiles = resolve(packageLocation, "../../webfonts");

    // If 'subset' is set to array, turn into object defaulted for 'solid' use (fontawesome free)
    if (Array.isArray(subset)) {
        subset = { solid: subset };
    }

    const iconMeta = yaml.parse(readFileSync(fontMeta, "utf8")) as IconYAML;
    const iconFamilyMeta = existsSync(fontFamilyMeta)
        ? (yaml.parse(readFileSync(fontFamilyMeta, "utf8")) as IconFamilyYAML)
        : null;
    const entries = Object.entries(subset);

    const promises: Promise<unknown>[] = [];
    const iconErrors: Partial<Record<Subset, string[]>> = {};

    for (const [key, icons] of entries) {
        // Skip if current font family is not found in font_map.
        if (fontTypes.indexOf(key) === -1) {
            continue;
        }

        // Bail early if icons isn't set, isn't an array, or is empty
        if (!Array.isArray(icons) || icons.length === 0) {
            continue;
        }

        const fontFamily = key as keyof typeof STYLE_FONT_MAP;
        const fontFileName = STYLE_FONT_MAP[fontFamily];
        const fontFilePath = resolve(fontFiles, `./${fontFileName}.ttf`);

        if (!existsSync(resolve(fontFilePath))) {
            console.warn(
                `Unable to find font file for requested font style '${fontFamily}'. Skipping.`
            );
            addIconError(iconErrors, fontFamily, icons);
            continue;
        }

        // Pull unicode characters from fontawesome yml, aggregating into array
        const unicodeCharacters: string[] = [];
        for (const icon of icons) {
            let foundIcon: FAIconType | FAFamilyMetaType | undefined;

            if (iconFamilyMeta) {
                foundIcon = findIconByName(iconFamilyMeta, icon);

                // Skip if the icon isn't found in our icon yaml
                if (!foundIcon || !iconHasStyle(foundIcon, fontFamily, packageType)) {
                    addIconError(iconErrors, fontFamily, icon);
                    continue;
                }
            } else {
                foundIcon = findIconByName(iconMeta, icon);

                // Skip if the icon isn't found in our icon yaml
                if (!foundIcon || !foundIcon.styles.includes(fontFamily)) {
                    addIconError(iconErrors, fontFamily, icon);
                    continue;
                }
            }

            const charCode = foundIcon.unicode;
            unicodeCharacters.push(String.fromCodePoint(parseInt(charCode, 16)));

            // Duotone secondary char codes are prefixed with a `10` for the secondary color
            if (fontFamily === "duotone") {
                unicodeCharacters.push(String.fromCodePoint(parseInt(`10${charCode}`, 16)));
            }
        }

        mkdirp.sync(resolve(outputDir));
        const fontData = readFileSync(fontFilePath);
        const outputFile = resolve(outputDir, fontFileName);

        // Loop over our requested output formats, and generate our subsets
        for (const targetFormat of targetFormats) {
            promises.push(
                subsetFont(fontData, unicodeCharacters.join(" "), {
                    targetFormat: targetFormat,
                }).then((data) => {
                    writeFileSync(`${outputFile}.${OUTPUT_FORMAT_MAP[targetFormat]}`, data);
                })
            );
        }
    }

    return Promise.all(promises).then(() => {
        const iconErrorArray = Object.entries(iconErrors).map(([style, missing_icons]) => ({
            style,
            missing_icons,
        }));
        if (iconErrorArray.length > 0) {
            console.warn(
                `\nOne or more icons were not found in the icon metadata. Check that the icon is available in your version, tier, and that you are requesting the correct style.`
            );
            console.table(iconErrorArray);
            console.warn(
                "See https://fontawesome.com/icons/ for icons, styles, and version availability."
            );

            return false;
        }

        return true;
    });
}

export { fontawesomeSubset };
export { FontAwesomeOptions, Subset, SubsetOption, GlyphName } from "./types";
