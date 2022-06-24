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
const YAML = require("yaml");
const Glob = require("glob");
const subsetFont = require("subset-font");
const fs = require("fs");

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
        duotone: "fa-duotone-900",
    };
    const fontTypes = Object.keys(fontMap);

    // Check to see if the user has either free, or pro installed.
    try {
        require.resolve(`@fortawesome/fontawesome-${options.package}`);
    } catch(e) {
        console.error(`Package @fortawesome/fontawesome-${options.package} not found, run 'npm i @fortawesome/fontawesome-${options.package}' to install.`);
        return;
    }

    const faFile = require.resolve(`@fortawesome/fontawesome-${options.package}`);
    const fontMeta = resolve(faFile, '../../metadata/icons.yml');
    const fontFiles = resolve(faFile, '../../webfonts');


    // If 'subset' is set to array, turn into object defaulted for 'solid' use (fontawesome free)
    if (Array.isArray(subset)) {
        subset = { solid: subset };
    }

    const outputTypes = [
        { targetFormat: "woff2", fileExt: "woff2" },
        { targetFormat: "sfnt", fileExt: "ttf" },
    ];

    if (!existsSync(fontMeta)) {
        console.error(`Unable to find font meta file.`);
        return;
    }

    const iconYaml = fs.readFileSync(fontMeta, "utf8");
    const iconMeta = YAML.parse(iconYaml);

    makeDirSync(resolve(outputDir));

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
        const ttfFileName = fontMap[fontFamily];
        const ttfFilePath = `node_modules/@fortawesome/fontawesome-${options.package}/webfonts/${ttfFileName}.ttf`;

        if (!existsSync(ttfFilePath)) {
            console.warn(`Unable to find TTF font file for requested font style '${fontFamily}'. Skipping.`);
            continue;
        }

        const fontData = fs.readFileSync(ttfFilePath);
        let iconSubSetUnicode: string[] = [];
        icons.forEach((ico) => {
            if (!(ico in iconMeta)) {
                console.warn(`Icon '${ico}' is not found in font metadata. Skipping.`);
            } else {
                iconSubSetUnicode.push(String.fromCodePoint(parseInt(iconMeta[ico]["unicode"], 16)));
            }
        });

        outputTypes.forEach((ftype) => {
            const subsetBuffer = subsetFont(fontData, iconSubSetUnicode.join(" "), {
                targetFormat: ftype.targetFormat,
            });

            subsetBuffer.then((data: any) => {
                const outputFile = resolve(outputDir, ttfFileName);
                writeFileSync(outputFile + "." + ftype.fileExt, data);
                if (ftype.fileExt === "ttf") {
                    writeFileSync(`${outputFile}.eot`, ttf2eot(data));
                    writeFileSync(`${outputFile}.woff`, ttf2woff(data));
                }
            });
        });
    }
}

export { fontawesomeSubset };
export * from "./types";
