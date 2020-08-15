export interface FontAwesomeOptions {
    package: "free" | "pro";
}

export type Subset = "solid" | "light" | "regular" | "brands" | "duotone";

export type GlyphName = string;

export type SubsetOption = GlyphName[] | Partial<Record<Subset, GlyphName[]>>;
