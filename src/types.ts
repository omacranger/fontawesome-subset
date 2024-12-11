export interface FontAwesomeOptions {
    /**
     * The FontAwesome package type we should use. Defaults to 'free'.
     */
    package?: PackageType;
    /**
     * Requested font output targets.
     */
    targetFormats?: TargetFormat[];
}

export type PackageType = "free" | "pro";

export type Subset =
    | "solid"
    | "light"
    | "regular"
    | "thin"
    | "brands"
    | "duotone"
    | "sharp-solid"
    | "sharp-regular"
    | "sharp-light"
    | "sharp-thin"
    | "duotone-light"
    | "duotone-regular"
    | "duotone-thin"
    | "sharp-duotone-light"
    | "sharp-duotone-regular"
    | "sharp-duotone-solid"
    | "sharp-duotone-thin";

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

export type FAFamilyType = "classic" | "duotone" | "sharp" | "sharp-duotone";
export type FAStyleType = "solid" | "thin" | "light" | "regular" | "brands";

/**
 * Type of individual result / item inside the YAML file.
 */
export interface FAFamilyMetaType {
    /**
     * Label / display name of the icon.
     */
    label: string;
    /**
     * Unicode character for the icon.
     */
    unicode: string;
    /**
     * Family styles available for each icon & family type.
     */
    familyStylesByLicense: Record<
        PackageType,
        {
            family: FAFamilyType;
            style: FAStyleType;
        }[]
    >;
}

/**
 * Type of the YAML files bundled with FontAwesome.
 */
export type IconYAML = Record<GlyphName, FAIconType | undefined>;

/**
 * Type of the YAML files bundled with FontAwesome.
 */
export type IconFamilyYAML = Record<GlyphName, FAFamilyMetaType | undefined>;
