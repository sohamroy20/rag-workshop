import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { getTextExtractor } from 'office-text-extractor';
import { WebLoader } from './web-loader.js';
import { PdfLoader } from './pdf-loader.js';
import { SitemapLoader } from './sitemap-loader.js';
export class JsonCollectionsLoader extends BaseLoader {
    constructor({ url, chunkSize, chunkOverlap }) {
        super(`SitemapLoader_${md5(url)}`, chunkSize ?? 2000, chunkOverlap);
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.url = url;
    }
    async *getUnfilteredChunks() {
        const extractor = getTextExtractor();
        const docxParsed = await extractor.extractText({ input: this.url, type: 'file' });
        const sites = JSON.parse(docxParsed).links;
        console.log(sites);
        for (const url of sites) {
            let adjustedUrl = "";
            let withSubpages = false;
            if (typeof url === 'string') {
                adjustedUrl = url;
            }
            else {
                adjustedUrl = url.link;
                withSubpages = url.subpages;
            }
            adjustedUrl = adjustedUrl;
            let msg = "🆕LOADING";
            if (withSubpages) {
                msg += " with subpages";
            }
            msg += `: ${adjustedUrl}`;
            console.log(msg);
            if (adjustedUrl.toLowerCase().endsWith(".xml")) {
                const sitemapLoader = new SitemapLoader({ url, chunkSize: this.chunkSize, chunkOverlap: this.chunkOverlap });
                for await (const chunk of sitemapLoader.getUnfilteredChunks()) {
                    yield {
                        ...chunk,
                        metadata: {
                            ...chunk.metadata,
                            type: 'JsonCollectionsLoader',
                            originalSource: this.url,
                        },
                    };
                }
            }
            else if (adjustedUrl.toLowerCase().endsWith(".pdf")) {
                const pdfLoader = new PdfLoader({ url, chunkSize: this.chunkSize, chunkOverlap: this.chunkOverlap });
                for await (const chunk of pdfLoader.getUnfilteredChunks()) {
                    yield {
                        ...chunk,
                        metadata: {
                            ...chunk.metadata,
                            type: 'JsonCollectionsLoader',
                            originalSource: this.reformatFilePath(this.url),
                        },
                    };
                }
            }
            else {
                try {
                    const webLoader = new WebLoader({
                        url: adjustedUrl,
                        chunkSize: this.chunkSize,
                        chunkOverlap: this.chunkOverlap,
                        withSubpages
                    });
                    for await (const chunk of webLoader.getUnfilteredChunks()) {
                        yield {
                            ...chunk,
                            metadata: {
                                ...chunk.metadata,
                                type: 'JsonCollectionsLoader',
                                originalSource: this.url,
                            },
                        };
                    }
                }
                catch (error) {
                    console.log("Could not load: " + adjustedUrl);
                }
            }
        }
    }
    reformatFilePath(filePath) {
        return filePath.replace(/ /g, '%20');
    }
}
