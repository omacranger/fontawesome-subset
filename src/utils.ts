import { IconYAML, Subset } from "./types";

/**
 * Find an icon using the IconYAML provided by FontAwesome.
 */
export function findIconByName(yaml: IconYAML, iconName: string) {
    return yaml[iconName];
}

/**
 * Add an icon to the debug / warning error report.
 *
 * @param errors
 * @param fontFamily
 * @param icon
 */
export function addIconError(
    errors: Partial<Record<Subset, string[]>>,
    fontFamily: Subset,
    icon: string | string[]
) {
    const iconArray = Array.isArray(icon) ? icon : [icon];
    if (!errors[fontFamily]?.push(...iconArray)) {
        errors[fontFamily] = iconArray;
    }
}
