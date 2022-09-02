import { IconYAML, Subset } from "./types";

/**
 * Find an icon using the IconYAML provided by FontAwesome.
 * @param yaml
 * @param iconNameOrAlias The name, unicode value, or supported alias of the icon.
 */
export function findIconByName(yaml: IconYAML, iconNameOrAlias: string) {
    const icon = yaml[iconNameOrAlias];
    if (icon) return icon;

    const keyForAlias = Object.keys(yaml).find(
        (k) =>
            yaml[k]?.unicode === iconNameOrAlias ||
            yaml[k]?.aliases?.names?.includes(iconNameOrAlias) ||
            yaml[k]?.aliases?.unicodes?.composite?.includes(iconNameOrAlias) ||
            yaml[k]?.aliases?.unicodes?.secondary?.includes(iconNameOrAlias)
    );
    if (keyForAlias) return yaml[keyForAlias];

    return undefined;
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
