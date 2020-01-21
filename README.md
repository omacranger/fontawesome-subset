# FontAwesome Subset

Love FontAwesome but don't need thousands of icons bundled on every page of the site? Me either. `fontawesome-subset` is a utility for creating subsets of FontAwesome for optimized use on the web. It works by taking glyph names that you've used (`angle-left`, `caret-up`, etc) and creating an optimized font with only the glyphs you need. Yes, SVG icons and fragments are fancier and more feature filled - but if you already have a website built using the webfont - why switch -- right?

## Usage
Install: 
```bash
npm install --save-dev fontawesome-subset 
```

Run via your favorite task runner:
```javascript
// Require fontawesome-subset
const fontawesomeSubset = require('fontawesome-subset');

// Create or append a task to be ran with your configuration
fontawesomeSubset(['check','square','caret-up'], 'sass/webfonts');
```

### Full Options

#### fontawesomeSubset(subset, output_dir, options)
- `subset` - Array containing list of glyph names (icon names) that you want to limit the subset to. When using FontAwesome Pro (see [below](#using-with-fontawesome-pro)) you can supply an object with key->value pairs for different FA styles (solid, regular, light, brands, duotone).
- `output_dir` - Directory that you want the webfonts to be generated in. Relative to current NPM process. Ex: `sass/webfonts`
- `options` - Object of options to further customize the tool.
    - `package` - `free` or `pro` . Defaults to `free` version. See [below](#using-with-fontawesome-pro) for Pro instructions.
    
    
### Using with FontAwesome Pro
FontAwesome (FA) Pro provides numerous additional icons, as well as different font weights (styles) that you can use. Obviously, you'll need to own the 'Pro' version of FA in order to use with this subsetting tool. If you've already purchased a license, follow the [installation instructions](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers) for getting FontAwesome Pro up and running through NPM.

After installation, you can supply additional information to the `subset` parameter of `fontawesomeSubset` to create families for specific font styles. Make sure to include `package: 'pro'` inside the options parameter to generate from the Pro source instead and enable font creation for different weights / styles. 

#### Example generating separate glyphs for 'regular' and 'solid' styles:
```javascript
fontawesomeSubset({
    regular: ['check','square','caret-up'],
    solid: ['plus','minus']  
},
'sass/webfonts',
{
    package: 'pro'
});
```

You can use any of the weights / sets provided by FontAwesome Pro including `solid`, `regular`, `light`, `brands`, or `duotone`. You can mix and match and provide as many glyphs as you plan on using to trim it down.

The above example would output a directory with the following structure:
```
/sass/
    /webfonts/
        fa-regular-400.eot
        fa-regular-400.svg
        fa-regular-400.ttf
        fa-regular-400.woff
        fa-regular-400.woff2
        fa-solid-900.eot
        fa-solid-900.svg
        fa-solid-900.ttf
        fa-solid-900.woff
        fa-solid-900.woff2
```

It is still up to you to determine which glyphs you need and to pass them to the function to generate the webfonts. I recommend optimizing your CSS files as well to get the most from the tool.

### Using with SCSS / SASS

If you already have FA installed on your server in relation to your NPM project, you can point the `output_dir` to the webfonts directory that you're already loading and the script will overwrite the current fonts with the newly minified / optimized versions. If you plan on getting a bit more granular you can always edit the `_icons.scss` file provided by the FA team and remove all glyphs that you're not using to save a few more KBs for your end user.

Here's an example of the `_icons.scss` file on a project I've worked on using a sass map for the glyph name `->` variable provided in the `_variables.scss` file: 

```scss
$icons: (
        shopping-cart: $fa-var-shopping-cart,
        chevron-right: $fa-var-chevron-right,
        chevron-left: $fa-var-chevron-left,
        chevron-down: $fa-var-chevron-down,
        check-square: $fa-var-check-square,
        square: $fa-var-square,
        caret-up: $fa-var-caret-up,
        plus: $fa-var-plus,
        minus: $fa-var-minus,
        times: $fa-var-times,
        search: $fa-var-search,
        check: $fa-var-check,
);

@each $key, $value in $icons {
    .#{$fa-css-prefix}-#{$key}:before {
        content: fa-content($value);
    }
}
```
