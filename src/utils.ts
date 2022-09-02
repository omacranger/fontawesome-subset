import {
    FAFamilyMetaType,
    FAFamilyType,
    FAIconType,
    FAStyleType,
    IconFamilyYAML,
    IconYAML,
    PackageType,
    Subset,
} from "./types";
import { SUBSET_FAMILY_MAP, SUBSET_STYLE_MAP } from "./constants";

export function findIconByName(yaml: IconYAML, iconNameOrAlias: string): FAIconType | undefined;
export function findIconByName(
    yaml: IconFamilyYAML,
    iconNameOrAlias: string
): FAFamilyMetaType | undefined;

/**
 * Find an icon using the IconYAML provided by FontAwesome.
 * @param yaml
 * @param iconNameOrAlias The name, unicode value, or supported alias of the icon.
 */
export function findIconByName(yaml: IconYAML | IconFamilyYAML, iconNameOrAlias: string) {
    const icon = yaml[iconNameOrAlias];
    if (icon) return icon;

    const keyForAlias = Object.keys(yaml).find((k) => {
        const icon = yaml[k];
        if (!icon) return false;
        return (
            icon.unicode === iconNameOrAlias ||
            ("aliases" in icon &&
                (icon.aliases?.names?.includes(iconNameOrAlias) ||
                    icon.aliases?.unicodes?.composite?.includes(iconNameOrAlias) ||
                    icon.aliases?.unicodes?.secondary?.includes(iconNameOrAlias)))
        );
    });
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

/**
 * Check if an icon supports the requested style.
 *
 * @param icon
 * @param subset
 * @param packageType
 */
export function iconHasStyle(
    icon: FAFamilyMetaType,
    subset: Subset,
    packageType: PackageType
): boolean {
    const desiredStyle = getFamilyMetaBySubset(subset);
    return !!icon.familyStylesByLicense[packageType].find(
        (familyStyle) =>
            familyStyle.style === desiredStyle.style && familyStyle.family === desiredStyle.family
    );
}

/**
 * Convert FontAwesome's confusing new naming scheme to the previous 'styles'
 * listed in the old icon meta.
 *
 * @param subset
 */
export const getFamilyMetaBySubset = (
    subset: Subset
): {
    family: FAFamilyType;
    style: FAStyleType;
} => ({
    family: SUBSET_FAMILY_MAP[subset],
    style: SUBSET_STYLE_MAP[subset],
});
