#FontAwesome Subset

Love FontAwesome but don't need 1800 icons bundled on every page of the site? Me either. `fontawesome-subset` is a utility for creating subsets of FontAwesome for optimized use on the web. It works by taking glyph names that you've used (`angle-left`,`caret-up`, etc) and creating an optimized font with only the glyphs you need. Yes, SVG icons and fragments are fancier and more feature filled - but if you already have a website built using the webfont - why switch right?  


## Usage
Install: 
```bash
npm install --save-dev 
```

Run via your favorite task manager:
```javascript
const fontawesomeSubset = require('fontawesome-subset');

fontawesomeSubset(['check','square','caret-up'], 'sass/webfonts');
```

### Full Options

#### fontawesomeSubset(subset, output_dir, options)
- `subset` - Array containing list of glyph names (icon names) that you want to limit the subset to. When using FontAwesome Pro (see [below](#using-with-fontawesome-pro)) you can supply an object with key->value pairs for FA style (solid, regular, light).
- `output_dir` - Directory that you want the webfonts to be generated in. Relative to current NPM process. Ex: `sass/webfonts`
- `options` - Object of options to further customize the tool.
    - `package` - `free` or `pro` . Defaults to `free` version. See [below](#using-with-fontawesome-pro) for Pro instructions.
    
    
### Using with FontAwesome Pro
FontAwesome Pro provides numerous additional icons, as well as different font weights (styles) that you can use. Obviously, you'll need to own the 'Pro' version of 'FontAwesome Pro' in order to use with this subsetting tool. If you've already purchased a license, follow the [installation instructions](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers) for getting FontAwesome Pro up and running through NPM.

After you've successfully installed FontAwesome Pro, you can supply 