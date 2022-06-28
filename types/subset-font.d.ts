declare module "subset-font" {
    export type TargetFormat = 'sfnt' | 'woff' | 'woff2' | 'truetype';

    export interface SubsetFontOptions {
        targetFormat?: TargetFormat;
        preserveNameIds?: number[];
    }

    function subsetFont(buffer: Buffer, text: string, options: SubsetFontOptions): Promise<Buffer>;

    export = subsetFont;
}