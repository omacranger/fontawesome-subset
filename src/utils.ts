import { IconYAML, Subset } from "./types";

/**
 * Find an icon using the IconYAML provided by FontAwesome.
 */
 export function findIconByName(yaml: IconYAML, iconName: string) {
    const icon = yaml[iconName];
    if (icon) {
      return icon;
    }
    const keyForAlias = Object.keys(yaml).find((k) =>
      yaml[k]?.aliases?.names?.includes(iconName)
    );
    if (keyForAlias) {
      return yaml[keyForAlias];
    }
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
