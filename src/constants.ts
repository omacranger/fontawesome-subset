import { FAFamilyType, FAStyleType, Subset, TargetFormat } from "./types";

// Maps style to actual font name / file name.
export const STYLE_FONT_MAP: Record<Subset, string> = {
    solid: "fa-solid-900",
    light: "fa-light-300",
    regular: "fa-regular-400",
    thin: "fa-thin-100",
    brands: "fa-brands-400",
    duotone: "fa-duotone-900",
    "sharp-solid": "fa-sharp-solid-900",
};

export const OUTPUT_FORMAT_MAP: Record<TargetFormat, string> = {
    sfnt: "ttf",
    woff: "woff",
    woff2: "woff2",
};

export const SUBSET_FAMILY_MAP: Record<Subset, FAFamilyType> = {
    "sharp-solid": "sharp",
    brands: "classic",
    duotone: "duotone",
    light: "classic",
    regular: "classic",
    solid: "classic",
    thin: "classic",
};

export const SUBSET_STYLE_MAP: Record<Subset, FAStyleType> = {
    "sharp-solid": "solid",
    brands: "brands",
    duotone: "solid",
    light: "light",
    regular: "regular",
    solid: "solid",
    thin: "thin",
};
