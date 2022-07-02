import { tmpdir } from "os";
import { sep } from "path";
import { mkdtemp } from "fs";

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
