/**
 * Author: Logan Graham <loganparkergraham@gmail.com>
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { sync as makeDirSync } from "mkdirp";
import { FontAwesomeOptions, IconYAML, Subset, SubsetOption, TargetFormat } from "./types";
import subsetFont from "subset-font";
import yaml from "yaml";
import { addIconError, findIconByName } from "./utils";

const OUTPUT_FORMAT_MAP: Record<TargetFormat, string> = {
    sfnt: "ttf",
    woff: "woff",
    woff2: "woff2",
};

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
    const fontMap: Record<Subset, string> = {
        solid: "fa-solid-900",
        light: "fa-light-300",
        regular: "fa-regular-400",
        thin: "fa-thin-100",
        brands: "fa-brands-400",
        duotone: "fa-duotone-900",
    };
    const fontTypes = Object.keys(fontMap);
    let packageLocation: string;

    // Check to see if the user has either free, or pro installed.
    try {
        packageLocation = require.resolve(`@fortawesome/fontawesome-${packageType}`);
    } catch (e) {
        console.error(
            "Unable to find either the Free or Pro FontAwesome files in node_modules folder. Double-check that you have your preferred fontawesome package as a dependency in `package.json` and rerun the installation."
        );
        return Promise.resolve(false);
    }

    // Check that we have atleast one target format for output
    if (!Array.isArray(targetFormats) || targetFormats.length === 0) {
        console.error("One or more target formats are required. Exiting.");

        return Promise.resolve(false);
    }

    const fontMeta = resolve(packageLocation, "../../metadata/icons.yml");
    const fontFiles = resolve(packageLocation, "../../webfonts");

    // If 'subset' is set to array, turn into object defaulted for 'solid' use (fontawesome free)
    if (Array.isArray(subset)) {
        subset = { solid: subset };
    }

    const iconMeta: IconYAML = yaml.parse(readFileSync(fontMeta, "utf8"));
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

        const fontFamily = key as keyof typeof fontMap;
        const fontFileName = fontMap[fontFamily];
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
            const foundIcon = findIconByName(iconMeta, icon);

            if (!foundIcon || !foundIcon.styles.includes(fontFamily)) {
                addIconError(iconErrors, fontFamily, icon);
            } else {
                const charCode = foundIcon.unicode;
                unicodeCharacters.push(String.fromCodePoint(parseInt(charCode, 16)));

                // Duotone secondary char codes are prefixed with a `10` for the secondary color
                if (fontFamily === "duotone") {
                    unicodeCharacters.push(String.fromCodePoint(parseInt(`10${charCode}`, 16)));
                }
            }
        }

        makeDirSync(resolve(outputDir));
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
