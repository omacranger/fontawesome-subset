import { tmpdir } from "os";
import { resolve, sep } from "path";
import { mkdtemp, readFileSync } from "fs";
import { PackageType } from "../src/types";
import { compare } from "compare-versions";

const PACKAGE_ENV = process.env.FA_TEST_PACKAGE ?? "";
export const PACKAGE: PackageType = ["free", "pro"].includes(PACKAGE_ENV)
    ? (PACKAGE_ENV as PackageType)
    : "free";
const OS_TEMP_DIR = tmpdir();
export const SEP = sep;

/**
 * Create a unique temporary directory.
 */
export async function createTempDir() {
    return new Promise<string>((resolve) => {
        mkdtemp(`${OS_TEMP_DIR}${SEP}`, (err, folder) => {
            resolve(folder);
        });
    });
}

const FA_VERSION =
    JSON.parse(
        readFileSync(
            resolve(require.resolve(`@fortawesome/fontawesome-${PACKAGE}`), "../../package.json"),
            "utf-8"
        )
    ).version ?? "";

/**
 * it, but only on free packages.
 */
export const itFree = PACKAGE === "free" ? it : it.skip;

/**
 * it, but only on pro packages.
 */
export const itPro = PACKAGE === "pro" ? it : it.skip;

/**
 * It, but we're even more concerned about package or version specific features.
 *
 * @param version
 * @param packageType
 */
export const itGTE = (version: string, packageType?: PackageType) =>
    compare(FA_VERSION, version, ">=") && (!packageType || packageType === PACKAGE) ? it : it.skip;
