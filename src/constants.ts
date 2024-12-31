import { FAFamilyType, FAStyleType, Subset, TargetFormat } from "./types";

// Maps style to actual font name / file name.
export const STYLE_FONT_MAP: Record<Subset, string> = {
    solid: "fa-solid-900",
    light: "fa-light-300",
    regular: "fa-regular-400",
    thin: "fa-thin-100",
    brands: "fa-brands-400",
    duotone: "fa-duotone-900",
    "sharp-light": "fa-sharp-light-300",
    "sharp-regular": "fa-sharp-regular-400",
    "sharp-solid": "fa-sharp-solid-900",
    "sharp-thin": "fa-sharp-thin-100",
    "duotone-light": "fa-duotone-light-300",
    "duotone-regular": "fa-duotone-regular-400",
    "duotone-thin": "fa-duotone-thin-100",
    "sharp-duotone-light": "fa-sharp-duotone-light-300",
    "sharp-duotone-regular": "fa-sharp-duotone-regular-400",
    "sharp-duotone-solid": "fa-sharp-duotone-solid-900",
    "sharp-duotone-thin": "fa-sharp-duotone-thin-100",
};

export const OUTPUT_FORMAT_MAP: Record<TargetFormat, string> = {
    sfnt: "ttf",
    woff: "woff",
    woff2: "woff2",
};

export const SUBSET_FAMILY_MAP: Record<Subset, FAFamilyType> = {
    "sharp-light": "sharp",
    "sharp-regular": "sharp",
    "sharp-solid": "sharp",
    "sharp-thin": "sharp",
    "duotone-regular": "duotone",
    "duotone-light": "duotone",
    "duotone-thin": "duotone",
    "sharp-duotone-solid": "sharp-duotone",
    "sharp-duotone-regular": "sharp-duotone",
    "sharp-duotone-light": "sharp-duotone",
    "sharp-duotone-thin": "sharp-duotone",
    brands: "classic",
    duotone: "duotone",
    light: "classic",
    regular: "classic",
    solid: "classic",
    thin: "classic",
};

export const SUBSET_STYLE_MAP: Record<Subset, FAStyleType> = {
    "sharp-light": "light",
    "sharp-regular": "regular",
    "sharp-solid": "solid",
    "sharp-thin": "thin",
    "duotone-light": "light",
    "duotone-regular": "regular",
    "duotone-thin": "thin",
    "sharp-duotone-light": "light",
    "sharp-duotone-regular": "regular",
    "sharp-duotone-solid": "solid",
    "sharp-duotone-thin": "thin",
    brands: "brands",
    duotone: "solid",
    light: "light",
    regular: "regular",
    solid: "solid",
    thin: "thin",
};
