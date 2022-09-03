import subsetFont from "subset-font";
import fs, { existsSync, readFileSync } from "fs";
import { loadSync } from "opentype.js";
import { createTempDir, itFree, itGTE, itPro, PACKAGE, SEP } from "./test-utils";
import { fontawesomeSubset, SubsetOption } from "../src";
import yaml from "yaml";
import { findIconByName } from "../src/utils";

jest.mock("subset-font", () => ({
    __esModule: true,
    default: jest.fn(() => Promise.resolve(Buffer.from(""))),
}));

const subsetMock = jest.mocked(subsetFont);
const subsetActual = jest.requireActual("subset-font");

describe("fontawesomeSubset", () => {
    beforeEach(() => {
        // Set all tests to use mocked subset-font unless specified
        subsetMock.mockImplementation(jest.fn(() => Promise.resolve(Buffer.from(""))));
    });

    const testShouldAllAllRequiredGlyphs = async (
        subsets: SubsetOption,
        expected: { family: string; icon: string; duotone?: boolean }[]
    ) => {
        subsetMock.mockImplementation(subsetActual);

        const IconYAML = yaml.parse(
            readFileSync(
                require.resolve(`@fortawesome/fontawesome-${PACKAGE}/metadata/icons.yml`),
                "utf8"
            )
        );

        const tempDir = await createTempDir();
        await fontawesomeSubset(subsets, tempDir, { package: PACKAGE });

        for (const expectation of expected) {
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
    };

    itPro("should add all requested glyphs for valid icons", async () => {
        // 6 + 1 extra since duotone has two
        expect.assertions(6);

        await testShouldAllAllRequiredGlyphs(
            {
                solid: ["plus"],
                regular: ["bell"],
                brands: ["android"],
                duotone: ["bells"],
                light: ["plus"],
            },
            [
                { family: "fa-solid-900", icon: "plus" },
                { family: "fa-regular-400", icon: "bell" },
                { family: "fa-brands-400", icon: "android" },
                { family: "fa-duotone-900", duotone: true, icon: "bells" },
                { family: "fa-light-300", icon: "plus" },
            ]
        );
    });

    itFree("should add all requested glyphs for valid icons", async () => {
        expect.assertions(2);

        await testShouldAllAllRequiredGlyphs(
            {
                solid: ["plus"],
                regular: ["bell"],
            },
            [
                { family: "fa-solid-900", icon: "plus" },
                { family: "fa-regular-400", icon: "bell" },
            ]
        );
    });

    itGTE("6.0.0", "pro")(
        "should add requested glyphs for the thin font on supported versions",
        async () => {
            expect.assertions(1);

            await testShouldAllAllRequiredGlyphs(
                {
                    thin: ["plus"],
                },
                [{ family: "fa-thin-100", icon: "plus" }]
            );
        }
    );

    itGTE("6.2.0", "pro")("should add requested glyphs for new font styles", async () => {
        expect.assertions(1);

        await testShouldAllAllRequiredGlyphs(
            {
                "sharp-solid": ["star"],
            },
            [{ family: "fa-sharp-solid-900", icon: "star" }]
        );
    });

    const testShouldCreateRequestedFontFiles = async (
        subsets: SubsetOption,
        expectedFonts: string[]
    ) => {
        const tempDir = await createTempDir();
        await fontawesomeSubset(subsets, tempDir, {
            package: PACKAGE,
            targetFormats: ["woff2", "woff", "sfnt"],
        });

        const fontNames = expectedFonts
            .map((name) => [`${name}.ttf`, `${name}.woff`, `${name}.woff2`])
            .flat();
        const fontPromises = fontNames.map((name) => fs.promises.access(`${tempDir}${SEP}${name}`));
        const wasSuccessful = await Promise.all(fontPromises)
            .then(() => true)
            .catch((err) => console.log(err));
        expect(wasSuccessful).toBeTruthy();
    };

    itPro("should create ttf, woff, and woff2 files for each requested subset", async () => {
        await testShouldCreateRequestedFontFiles(
            {
                solid: ["plus"],
                regular: ["bell"],
                brands: ["android"],
                light: ["acorn"],
                duotone: ["abacus"],
            },
            ["fa-solid-900", "fa-regular-400", "fa-brands-400", "fa-duotone-900", "fa-light-300"]
        );
    });

    itFree("should create ttf, woff, and woff2 files for each requested subset", async () => {
        await testShouldCreateRequestedFontFiles(
            {
                solid: ["plus"],
                regular: ["bell"],
            },
            ["fa-solid-900", "fa-regular-400"]
        );
    });

    itGTE("6.0.0", "pro")(
        "should create ttf, woff, and woff2 files for the thin font on supported versions",
        async () => {
            await testShouldCreateRequestedFontFiles(
                {
                    thin: ["album"],
                },
                ["fa-thin-100"]
            );
        }
    );

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
