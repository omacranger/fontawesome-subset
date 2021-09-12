/**
 * Author: Logan Graham <loganparkergraham@gmail.com>
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { sync as makeDirSync } from "mkdirp";
import { FontAwesomeOptions, Subset, SubsetOption } from "./types";
import svg2ttf from "svg2ttf";
import ttf2woff from "ttf2woff";
import ttf2woff2 = require("ttf2woff2");
import ttf2eot = require("ttf2eot");
import { FontOptions } from "svg2ttf";

/**
 * Returns a list of all glyph names that don't exist in user-provided 'icons' parameter
 *
 * @param svgFile The contents of the SVG file we're looking at.
 * @param fontFamily The current font family we're parsing.
 * @param icons Array of glyph names we want to keep / output.
 *
 * @return string[] List of glyph names to remove from the output.
 */
function findGlyphsToRemove(svgFile: string, fontFamily: Subset, icons: string[]): string[] {
    let glyphs = [],
        matcher = new RegExp('<glyph glyph-name="([^"]+)"', "gms");

    let current_match;

    while ((current_match = matcher.exec(svgFile))) {
        if (fontFamily === "duotone") {
            // If we're matching duotone we need to remove the trailing `-secondary` or `-primary`
            if (icons.indexOf(current_match[1].substring(0, current_match[1].lastIndexOf("-"))) === -1) {
                glyphs.push(current_match[1]);
            }
        } else {
            if (icons.indexOf(current_match[1]) === -1) {
                glyphs.push(current_match[1]);
            }
        }
    }

    return glyphs;
}

/**
 * This function will take an object of glyph names and output a subset of the standard fonts optimized in size for
 * use on websites / external resources.
 *
 * @param subset Array or Object containing glyph / font family names.
 * @param outputDir Directory output generated webfonts.
 * @param options Object of options / tweaks for further customization. Defaults to 'Free' package.
 */
function fontawesomeSubset(subset: SubsetOption, outputDir: string, options: FontAwesomeOptions = { package: "free" }) {
    // Maps style to actual font name / file name.
    const fontMap: Record<Subset, string> = {
        solid: "fa-solid-900",
        light: "fa-light-300",
        regular: "fa-regular-400",
        brands: "fa-brands-400",
        duotone: "fa-duotone-900"
    };
    const fontTypes = Object.keys(fontMap);

    // Check to see if the user has either free, or pro installed.
    if (!(existsSync("node_modules/@fortawesome/fontawesome-free") || existsSync("node_modules/@fortawesome/fontawesome-pro"))) {
        console.error("Unable to find either the Free or Pro FontAwesome files in node_modules folder. Double-check that you have your preferred fontawesome package as a dependency in `package.json` and rerun the installation.");
        return;
    }

    // If 'subset' is set to array, turn into object defaulted for 'solid' use (fontawesome free)
    if (Array.isArray(subset)) {
        subset = { solid: subset };
    }

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
        const svgFileName = fontMap[fontFamily];
        const svgFilePath = `node_modules/@fortawesome/fontawesome-${options.package}/webfonts/${svgFileName}.svg`;

        if (!existsSync(svgFilePath)) {
            console.warn(`Unable to find SVG font file for requested font style '${fontFamily}'. Skipping.`);
            continue;
        }

        const svgFile = readFileSync(svgFilePath).toString();
        const glyphsToRemove = findGlyphsToRemove(svgFile, fontFamily, icons);
        const svgContentsNew = svgFile.replace(new RegExp(`(<glyph glyph-name="(${glyphsToRemove.join("|")})".*?\\/>)`, "gms"), "").replace(/>\s+</gms, "><");
        const ttfUtils = svg2ttf(svgContentsNew, {
            fullname: "FontAwesome " + fontFamily,
            familyname: "FontAwesome",
            subfamilyname: fontFamily,
            ts: 0 // Manually specify empty timestamp for deterministic output
            // Casting these as @types are out of date for svg2ttf
        } as FontOptions);
        const ttf = Buffer.from(ttfUtils.buffer);

        makeDirSync(resolve(outputDir));

        const outputFile = resolve(outputDir, svgFileName);

        writeFileSync(`${outputFile}.svg`, svgContentsNew);
        writeFileSync(`${outputFile}.ttf`, ttf);
        writeFileSync(`${outputFile}.eot`, ttf2eot(ttf));
        writeFileSync(`${outputFile}.woff`, ttf2woff(ttf));
        writeFileSync(`${outputFile}.woff2`, ttf2woff2(ttf));
    }
}

export { fontawesomeSubset };
export * from "./types";
