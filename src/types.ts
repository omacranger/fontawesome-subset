export interface FontAwesomeOptions {
    package: "free" | "pro";
}

export type Subset = "solid" | "light" | "regular" | "thin" | "brands" | "duotone";

export type GlyphName = string;

export type SubsetOption = GlyphName[] | Partial<Record<Subset, GlyphName[]>>;

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
}

/**
 * Type of the YAML files bundled with FontAwesome.
 */
export type IconYAML = Record<GlyphName, FAIconType | undefined>;
