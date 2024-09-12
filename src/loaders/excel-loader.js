import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getTextExtractor } from 'office-text-extractor';
import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString } from '../util/strings.js';
export class ExcelLoader extends BaseLoader {
    constructor({ filePath, url, chunkSize, chunkOverlap, }) {
        super(`ExcelLoader_${md5(filePath ? `FILE_${filePath}` : `URL_${url}`)}`, chunkSize ?? 500, chunkOverlap ?? 0);
        Object.defineProperty(this, "pathOrUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.isUrl = filePath ? false : true;
        this.pathOrUrl = filePath ?? url;
    }
    async *getUnfilteredChunks() {
        const chunker = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });
        const extractor = getTextExtractor();
        const xlsxParsed = await extractor.extractText({ input: this.pathOrUrl, type: this.isUrl ? 'url' : 'file' });
        const chunks = await chunker.splitText(cleanString(xlsxParsed));
        for (const chunk of chunks) {
            yield {
                pageContent: chunk,
                metadata: {
                    type: 'ExcelLoader',
                    source: this.pathOrUrl,
                },
            };
        }
    }
}
