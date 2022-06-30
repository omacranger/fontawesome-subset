/**
 * Author: Logan Graham <loganparkergraham@gmail.com>
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { sync as makeDirSync } from "mkdirp";
import { FontAwesomeOptions, GlyphName, Subset, SubsetOption } from "./types";
import type { TargetFormat } from "subset-font";
import subsetFont from "subset-font";
import yaml from "yaml";

const OUTPUT_FORMATS: { targetFormat: TargetFormat; fileExt: string }[] = [
    { targetFormat: "woff2", fileExt: "woff2" },
    { targetFormat: "sfnt", fileExt: "ttf" },
];

/**
 * This function will take an object of glyph names and output a subset of the standard fonts optimized in size for
 * use on websites / external resources.
 *
 * @param subset Array or Object containing glyph / font family names.
 * @param outputDir Directory output generated webfonts.
 * @param options Object of options / tweaks for further customization. Defaults to 'Free' package.
 */
function fontawesomeSubset(subset: SubsetOption, outputDir: string, options: FontAwesomeOptions = { package: "free" }) {
    const packageType = options.package;
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
        console.error("Unable to find either the Free or Pro FontAwesome files in node_modules folder. Double-check that you have your preferred fontawesome package as a dependency in `package.json` and rerun the installation.");
        return;
    }

    const fontMeta = resolve(packageLocation, "../../metadata/icons.yml");
    const fontFiles = resolve(packageLocation, "../../webfonts");

    // If 'subset' is set to array, turn into object defaulted for 'solid' use (fontawesome free)
    if (Array.isArray(subset)) {
        subset = { solid: subset };
    }

    const iconMeta: Record<GlyphName, { unicode: string }> = yaml.parse(readFileSync(fontMeta, "utf8"));
    const entries = Object.entries(subset);
    for (const [key, icons] of entries) {
        // Skip if current font family is not found in font_map.
        if (fontTypes.indexOf(key) === -1) {
            continue;
        }

        // Bail early if icons isn't set, or isn't an array
        if (!Array.isArray(icons)) {
            continue;
        }

        const fontFamily = key as keyof typeof fontMap;
        const fontFileName = fontMap[fontFamily];
        const fontFilePath = resolve(fontFiles, `./${fontFileName}.ttf`);

        if (!existsSync(require.resolve(fontFilePath))) {
            console.warn(`Unable to find font file for requested font style '${fontFamily}'. Skipping.`);
            continue;
        }

        // Pull unicode characters from fontawesome yml, aggregating into array
        let unicodeCharacters: string[] = [];
        for (const icon of icons) {
            if (!(icon in iconMeta)) {
                console.warn(`Icon '${icon}' is not found in font metadata. Skipping.`);
            } else {
                const charCode = iconMeta[icon]["unicode"];
                unicodeCharacters.push(String.fromCodePoint(parseInt(charCode, 16)));

                // Duotone secondary char codes are prefixed with a `10` for the secondary color
                if(fontFamily === 'duotone'){
                    unicodeCharacters.push(String.fromCodePoint(parseInt(`10${charCode}`, 16)));
                }
            }
        }

        makeDirSync(resolve(outputDir));
        const fontData = readFileSync(fontFilePath);
        const outputFile = resolve(outputDir, fontFileName);

        // Loop over our requested output formats, and generate our subsets
        for (const oFormat of OUTPUT_FORMATS) {
            subsetFont(fontData, unicodeCharacters.join(" "), {
                targetFormat: oFormat.targetFormat,
            }).then((data) => {
                writeFileSync(`${outputFile}.${oFormat.fileExt}`, data);
            });
        }
    }
}

export { fontawesomeSubset };
export { FontAwesomeOptions, Subset, SubsetOption, GlyphName } from "./types";
