import yaml from "yaml";
import { addIconError, findIconByName } from "../src/utils";
import { Subset } from "../src";

const iconMetadata = yaml.parse(`
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
`);

describe("findIconByName", () => {
    it("should find an icon by the icon name", () => {
        const icon = findIconByName(iconMetadata, "plus");
        expect(icon).toBeTruthy();
        expect(icon?.unicode).toEqual("2b");
        expect(icon?.styles).toEqual(["solid"]);
    });

    it("should find an icon by an alias name", () => {
        const icon = findIconByName(iconMetadata, "add");
        expect(icon).toBeTruthy();
        expect(icon?.unicode).toEqual("2b");
        expect(icon?.styles).toEqual(["solid"]);
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
