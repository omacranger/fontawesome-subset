import yaml from "yaml";
import { addIconError, findIconByName, getFamilyMetaBySubset, iconHasStyle } from "../src/utils";
import { Subset } from "../src";
import { IconFamilyYAML, IconYAML } from "../src/types";

const iconMetadata: IconYAML = yaml.parse(`
plus:
  aliases:
    names:
      - add
    unicodes:
      composite:
        - '2795'
        - f067
      primary:
        - f067
      secondary:
        - 10f067
        - 102b
  changes:
    - 1.0.0
    - 5.0.0
    - 5.0.13
    - 6.0.0-beta1
  label: plus
  search:
    terms: []
  styles:
    - solid
  unicode: 2b
  voted: false
asterisk:
  aliases:
    unicodes:
      composite:
        - '2731'
        - f069
      primary:
        - f069
      secondary:
        - 10f069
        - 102a
  changes:
    - 1.0.0
    - 5.0.0
    - 6.0.0-beta1
  label: asterisk
  search:
    terms: []
  styles:
    - solid
    - regular
    - light
    - thin
    - duotone
  unicode: 2a
  voted: false
`);

const iconFamilyMetadata: IconFamilyYAML = yaml.parse(`
# Pro Family Data (pro only icon)
window:
  aliases:
    unicodes:
      secondary:
        - 10f40e
  changes:
    - 5.0.0
    - 6.0.0-beta1
    - 6.0.0-beta3
    - 6.2.0
  familyStylesByLicense:
    free: []
    pro:
      - family: classic
        style: solid
      - family: classic
        style: regular
      - family: classic
        style: light
      - family: classic
        style: thin
      - family: duotone
        style: solid
      - family: sharp
        style: solid
  label: Window
  unicode: f40e
  voted: false
# Free Family Data (fewer styles available, etc)
wrench:
  aliases:
    unicodes:
      composite:
        - 1f527
      secondary:
        - 10f0ad
  changes:
    - 2.0.0
    - 5.0.0
    - 5.0.13
    - 6.0.0-beta1
    - 6.2.0
  familyStylesByLicense:
    free:
      - family: classic
        style: solid
    pro:
      - family: classic
        style: solid
  label: Wrench
  unicode: f0ad
  voted: false
`);

describe("findIconByName", () => {
    it("should find an icon by the icon name", () => {
        const icon = findIconByName(iconMetadata, "plus");
        expect(icon).toBeTruthy();
        expect(icon?.unicode).toEqual("2b");
    });

    it("should find an icon by an alias name", () => {
        const icon = findIconByName(iconMetadata, "add");
        expect(icon).toBeTruthy();
        expect(icon?.unicode).toEqual("2b");
    });

    it("should find an icon by a unicode name", () => {
        const icon = findIconByName(iconMetadata, "2a");
        expect(icon).toBeTruthy();
        expect(icon?.unicode).toEqual("2a");
        expect(icon?.label).toEqual("asterisk");
    });

    it("should find an icon by a unicode alias composite value", () => {
        const icon = findIconByName(iconMetadata, "2795");
        expect(icon).toBeTruthy();
        expect(icon?.unicode).toEqual("2b");
        expect(icon?.label).toEqual("plus");
    });

    it("should find an icon by a unicode alias primary value", () => {
        const icon = findIconByName(iconMetadata, "f069");
        expect(icon).toBeTruthy();
        expect(icon?.unicode).toEqual("2a");
        expect(icon?.label).toEqual("asterisk");
    });

    it("should find an icon by a unicode alias secondary value", () => {
        const icon = findIconByName(iconMetadata, "102b");
        expect(icon).toBeTruthy();
        expect(icon?.unicode).toEqual("2b");
        expect(icon?.label).toEqual("plus");
    });
});

describe("addIconError", () => {
    it("should create an error entry for a subset when not already found", () => {
        const errorArray: Partial<Record<Subset, string[]>> = {};
        addIconError(errorArray, "solid", "plus");
        expect(errorArray).toEqual({ solid: ["plus"] });
    });

    it("should create an error entry to an existing array", () => {
        const errorArray: Partial<Record<Subset, string[]>> = { solid: ["plus"] };
        addIconError(errorArray, "solid", "minus");
        expect(errorArray).toEqual({ solid: ["plus", "minus"] });
    });
});

describe("iconHasStyle", () => {
    it("should check if an icon has the requested style", () => {
        const icon = findIconByName(iconFamilyMetadata, "window");
        expect(icon && iconHasStyle(icon, "solid", "pro")).toBeTruthy();
    });

    it("should check if an icon does not have the requested style (pro only)", () => {
        const icon = findIconByName(iconFamilyMetadata, "window");
        expect(icon && iconHasStyle(icon, "solid", "free")).toBeFalsy();
    });

    it("should check if an icon does not have the requested style (style not available)", () => {
        const icon = findIconByName(iconFamilyMetadata, "wrench");
        expect(icon && iconHasStyle(icon, "light", "free")).toBeFalsy();
    });

    it("should check if an icon supports the new / exclusive font styles", () => {
        const icon = findIconByName(iconFamilyMetadata, "window");
        expect(icon && iconHasStyle(icon, "sharp-solid", "pro")).toBeTruthy();
        expect(icon && iconHasStyle(icon, "sharp-solid", "free")).toBeFalsy();
    });
});

describe("getFamilyMetaBySubset", () => {
    it("should correctly map subsets to FA's new font style", () => {
        type Expected = ReturnType<typeof getFamilyMetaBySubset>;

        expect(getFamilyMetaBySubset("solid")).toEqual<Expected>({
            family: "classic",
            style: "solid",
        });
        expect(getFamilyMetaBySubset("regular")).toEqual<Expected>({
            family: "classic",
            style: "regular",
        });
        expect(getFamilyMetaBySubset("duotone")).toEqual<Expected>({
            family: "duotone",
            style: "solid",
        });
        expect(getFamilyMetaBySubset("light")).toEqual<Expected>({
            family: "classic",
            style: "light",
        });
        expect(getFamilyMetaBySubset("thin")).toEqual<Expected>({
            family: "classic",
            style: "thin",
        });
        expect(getFamilyMetaBySubset("sharp-solid")).toEqual<Expected>({
            family: "sharp",
            style: "solid",
        });
    });
});
