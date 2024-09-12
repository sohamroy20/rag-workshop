import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString, truncateCenterString } from '../util/strings.js';
export class TextLoader extends BaseLoader {
    constructor({ text, chunkSize, chunkOverlap }) {
        super(`TextLoader_${md5(text)}`, chunkSize ?? 300, chunkOverlap ?? 0);
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.text = text;
    }
    async *getUnfilteredChunks() {
        const tuncatedObjectString = truncateCenterString(this.text, 50);
        const chunker = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });
        const chunks = await chunker.splitText(cleanString(this.text));
        for (const chunk of chunks) {
            yield {
                pageContent: chunk,
                metadata: {
                    type: 'TextLoader',
                    source: tuncatedObjectString,
                    textId: this.uniqueId,
                },
            };
        }
    }
}
