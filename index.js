/**
 * Author: Logan Graham <loganparkergraham@gmail.com>
 */

const
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    svg2ttf = require('svg2ttf'),
    ttf2eot = require('ttf2eot'),
    ttf2woff = require('ttf2woff'),
    ttf2woff2 = require('ttf2woff2');

/**
 * This function will take an object of glyph names and output a subset of the standard fonts optimized in size for
 * use on websites / external resources.
 *
 * @param subset Array or Object containing glyph / font family names.
 * @param output_dir Directory output generated webfonts.
 * @param options Object of options / tweaks for further customization.
 */
function fontawesomeSubset(subset, output_dir, options){
    // Maps style to actual font name / file name.
    const font_map = {
        solid: 'fa-solid-900',
        light: 'fa-light-300',
        regular: 'fa-regular-400',
        brands: 'fa-brands-400',
        duotone: 'fa-duotone-900',
    };

    const opts = {
        ...{
            package: 'free',
        }, ...options
    };

    // If 'subset' is set to array, turn into object defaulted for 'solid' use (fontawesome free)
    if (Array.isArray(subset)) {
        subset = {'solid': subset};
    }

    for (let [font_family, icons] of Object.entries(subset)) {
        // Skip if invalid font family
        let svg_file_path = `node_modules/@fortawesome/fontawesome-${opts.package}/webfonts/${font_map[font_family]}.svg`;

        // Skip if current font family is not found in font_map.
        if (Object.keys(font_map).indexOf(font_family) === -1) {
            continue;
        }

        if (!fs.existsSync(svg_file_path)) {
            console.error("Missing fontawesome dependencies. Try running `npm install` or changing the font style.");
            continue;
        }

        const svg_file = fs.readFileSync(svg_file_path).toString(),
            glyphs_to_remove = ((svg_file) => {
                let glyphs = [],
                    matcher = new RegExp('<glyph glyph-name="([^"]+)"', 'gms'),
                    current_match;

                while (current_match = matcher.exec(svg_file)) {
                    if(font_family === 'duotone'){
                        // If we're matching duotone we need to remove the trailing `-secondary` or `-primary`
                        if (icons.indexOf(current_match[1].substring(0, current_match[1].lastIndexOf('-'))) === -1) {
                            glyphs.push(current_match[1]);
                        }
                    } else {
                        if (icons.indexOf(current_match[1]) === -1) {
                            glyphs.push(current_match[1]);
                        }
                    }
                }

                return glyphs;
            })(svg_file),
            svg_contents_new = svg_file.replace(new RegExp(`(<glyph glyph-name="(${glyphs_to_remove.join('|')})".*?\\/>)`, 'gms'), '').replace(/>\s+</gms, '><'),
            ttf_utils = svg2ttf(svg_contents_new, {
                fullname: 'FontAwesome ' + font_family,
                familyname: 'FontAwesome',
                subfamilyname: font_family,
            }),
            ttf = Buffer.from(ttf_utils.buffer);

        mkdirp.sync(path.resolve(output_dir), (err) => {
            if (err) {
                console.error(err);
                console.error("Unable to create directory for output files.");
            }
        });

        const output_file = path.resolve(output_dir, font_map[font_family]);

        fs.writeFileSync(`${output_file}.svg`, svg_contents_new);
        fs.writeFileSync(`${output_file}.ttf`, ttf);
        fs.writeFileSync(`${output_file}.eot`, ttf2eot(ttf).buffer);
        fs.writeFileSync(`${output_file}.woff`, ttf2woff(ttf).buffer);
        fs.writeFileSync(`${output_file}.woff2`, ttf2woff2(ttf));
    }
}

module.exports = fontawesomeSubset;