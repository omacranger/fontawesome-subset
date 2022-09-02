export interface FontAwesomeOptions {
    /**
     * The FontAwesome package type we should use. Defaults to 'free'.
     */
    package?: "free" | "pro";
    /**
     * Requested font output targets.
     */
    targetFormats?: TargetFormat[];
}

export type Subset = "solid" | "light" | "regular" | "thin" | "brands" | "duotone";

export type GlyphName = string;

export type SubsetOption = GlyphName[] | Partial<Record<Subset, GlyphName[]>>;

export type TargetFormat = "woff" | "woff2" | "sfnt";

/**
 * Type of individual result / item inside the YAML file.
 */
export interface FAIconType {
    /**
     * Label / display name of the icon.
     */
    label: string;
    /**
     * Unicode character for the icon.
     */
    unicode: string;
    /**
     * Subsets this icon is available in.
     */
    styles: Partial<Subset>[];
    /*
     * Alternative means of identifying the icon.
     */
    aliases?: {
        names?: string[];
        unicodes?: {
            composite?: string[];
            primary?: string[];
            secondary?: string[];
        };
    };
}

/**
 * Type of the YAML files bundled with FontAwesome.
 */
export type IconYAML = Record<GlyphName, FAIconType | undefined>;
