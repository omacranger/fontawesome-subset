import subsetFont from "subset-font";
import fs, { existsSync, readFileSync } from "fs";
import { loadSync } from "opentype.js";
import { createTempDir, SEP } from "./test-utils";
import { fontawesomeSubset } from "../src";
import yaml from "yaml";
import { findIconByName } from "../src/utils";
import { PackageType } from "../src/types";

jest.mock("subset-font", () => ({
    __esModule: true,
    default: jest.fn(() => Promise.resolve(Buffer.from(""))),
}));

const subsetMock = jest.mocked(subsetFont);
const subsetActual = jest.requireActual("subset-font");

const PACKAGE_ENV = process.env.FA_TEST_PACKAGE ?? "";
const PACKAGE: PackageType = ["free", "pro"].includes(PACKAGE_ENV)
    ? (PACKAGE_ENV as PackageType)
    : "free";

describe("fontawesomeSubset", () => {
    beforeEach(() => {
        // Set all tests to use mocked subset-font unless specified
        subsetMock.mockImplementation(jest.fn(() => Promise.resolve(Buffer.from(""))));
    });

    it("should add all requested glyphs for valid icons", async () => {
        subsetMock.mockImplementation(subsetActual);

        const IconYAML = yaml.parse(
            readFileSync(
                require.resolve(`@fortawesome/fontawesome-${PACKAGE}/metadata/icons.yml`),
                "utf8"
            )
        );

        const tempDir = await createTempDir();
        await fontawesomeSubset(
            {
                solid: ["plus"],
                regular: ["bell"],
                ...(PACKAGE === "pro"
                    ? {
                          brands: ["android"],
                          duotone: ["bells"],
                          light: ["plus"],
                          thin: ["plus"],
                          "sharp-solid": ["star"],
                      }
                    : {}),
            },
            tempDir,
            { package: PACKAGE }
        );

        // char codes taken from FA icon page, checking to make sure they exist in the glyphs object
        const EXPECTED = [
            { family: "fa-solid-900", icon: "plus" },
            { family: "fa-regular-400", icon: "bell" },
            ...(PACKAGE === "pro"
                ? [
                      { family: "fa-brands-400", icon: "android" },
                      { family: "fa-duotone-900", duotone: true, icon: "bells" },
                      { family: "fa-thin-100", icon: "plus" },
                      { family: "fa-light-300", icon: "plus" },
                      { family: "fa-sharp-solid-900", icon: "star" },
                  ]
                : []),
        ];

        // # of font styles + 1 extra for duotone
        expect.assertions(EXPECTED.length + (PACKAGE === "pro" ? 1 : 0));

        for (const expectation of EXPECTED) {
            const font = loadSync(`${tempDir}${SEP}${expectation.family}.ttf`);
            const icon = findIconByName(IconYAML, expectation.icon);
            const glyphIndex = icon
                ? font.charToGlyphIndex(String.fromCodePoint(parseInt(icon?.unicode, 16)))
                : 0;

            expect(glyphIndex).toBeGreaterThan(0);

            // If the icon is duotone, verify that we also have the secondary glyph
            if (expectation?.duotone) {
                const secondaryGlyphIndex = icon
                    ? font.charToGlyphIndex(
                          String.fromCodePoint(parseInt(`10${icon?.unicode}`, 16))
                      )
                    : 0;
                expect(secondaryGlyphIndex).toBeGreaterThan(0);
            }
        }
    });

    it("should create ttf, woff, and woff2 files for each requested subset", async () => {
        const tempDir = await createTempDir();
        await fontawesomeSubset(
            {
                solid: ["plus"],
                regular: ["bell"],
                ...(PACKAGE == "pro"
                    ? {
                          brands: ["android"],
                          light: ["acorn"],
                          thin: ["album"],
                          duotone: ["abacus"],
                      }
                    : {}),
            },
            tempDir,
            { package: PACKAGE, targetFormats: ["woff2", "woff", "sfnt"] }
        );

        const fontNames = [
            "fa-solid-900",
            "fa-regular-400",
            ...(PACKAGE === "pro"
                ? ["fa-brands-400", "fa-duotone-900", "fa-thin-100", "fa-light-300"]
                : []),
        ]
            .map((name) => [`${name}.ttf`, `${name}.woff`, `${name}.woff2`])
            .flat();
        const fontPromises = fontNames.map((name) => fs.promises.access(`${tempDir}${SEP}${name}`));
        const wasSuccessful = await Promise.all(fontPromises)
            .then(() => true)
            .catch((err) => console.log(err));
        expect(wasSuccessful).toBeTruthy();
    });

    it("should not create font files for empty icon arrays", async () => {
        const tempDir = await createTempDir();
        subsetMock.mockImplementation(subsetActual);
        await fontawesomeSubset([], tempDir);
        expect(existsSync(`${tempDir}${SEP}fa-solid-900.ttf`)).toBeFalsy();
    });

    it("should return true on a successful subset", async () => {
        const tempDir = await createTempDir();
        const response = await fontawesomeSubset(["plus"], tempDir);
        expect(response).toBeTruthy();
    });

    it("should return false when one or more icons were not found to be subsetted", async () => {
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => false);
        const tableSpy = jest.spyOn(console, "table").mockImplementation(() => false);
        const response = await fontawesomeSubset(["fake-icon-name"], "");

        expect(response).toBeFalsy();
        expect(warnSpy).toBeCalledTimes(2);
        expect(tableSpy).toBeCalledTimes(1);

        jest.resetAllMocks();
    });

    it("should warn when a font file is not found for a requested subset", async () => {
        jest.spyOn(fs, "existsSync").mockImplementation(() => false);
        const warnSpy = jest.spyOn(console, "warn").mockImplementationOnce(() => false);
        const response = await fontawesomeSubset(["fake-icon-name"], "");

        expect(warnSpy).toBeCalledWith(
            "Unable to find font file for requested font style 'solid'. Skipping."
        );
        expect(response).toBeFalsy();
    });

    it("should error when no target formats are provided", async () => {
        const errorSpy = jest.spyOn(console, "error").mockImplementationOnce(() => false);
        const response = await fontawesomeSubset(["arrow-left"], "", { targetFormats: [] });

        expect(errorSpy).toBeCalledWith("One or more target formats are required. Exiting.");
        expect(response).toBeFalsy();
    });
});
