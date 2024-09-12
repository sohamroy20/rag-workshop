import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import createDebugMessages from 'debug';
import { convert } from 'html-to-text';
import axios from 'axios';
import md5 from 'md5';
import * as cheerio from 'cheerio';
import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString, truncateCenterString } from '../util/strings.js';
export class WebLoader extends BaseLoader {
    constructor({ content, url, chunkSize, chunkOverlap, withSubpages, }) {
        super(`WebLoader_${md5(content ? `CONTENT_${content}` : `URL_${url}`)}`, chunkSize ?? 2000, chunkOverlap ?? 0);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('maap:loader:WebLoader')
        });
        Object.defineProperty(this, "contentOrUrl", {
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
        Object.defineProperty(this, "withSubpages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.isUrl = !content;
        this.withSubpages = withSubpages ? withSubpages : false;
        this.contentOrUrl = content ?? url;
    }
    async *getUnfilteredChunks() {
        const chunker = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });
        try {
            const data = this.isUrl
                ? (await axios.get(this.contentOrUrl, { responseType: 'document' })).data
                : this.contentOrUrl;
            if (this.withSubpages) {
                // search for links
                const html = cheerio.load(data);
                let links = [];
                html("a").each((_i, value) => {
                    let link = html(value).attr("href");
                    if (link.includes("unibas.ch")) {
                        links.push(link);
                    }
                });
                for (let link of links) {
                    console.log("🆕LOADING Subpage: " + link);
                    const webLoader = new WebLoader({ url: link, chunkSize: this.chunkSize, chunkOverlap: this.chunkOverlap, withSubpages: false });
                    for await (const chunk of webLoader.getUnfilteredChunks()) {
                        yield {
                            ...chunk,
                            metadata: {
                                ...chunk.metadata,
                                type: 'JsonCollectionsLoader',
                                originalSource: link,
                            },
                        };
                    }
                }
            }
            const text = convert(data, {
                baseElements: {
                    selectors: ['section.content_block'],
                },
                wordwrap: false,
                preserveNewlines: false,
            }).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
            const tuncatedObjectString = this.isUrl ? undefined : truncateCenterString(this.contentOrUrl, 50);
            const chunks = await chunker.splitText(cleanString(text));
            for (const chunk of chunks) {
                yield {
                    pageContent: chunk,
                    metadata: {
                        type: 'WebLoader',
                        source: this.isUrl ? this.contentOrUrl : tuncatedObjectString,
                    },
                };
            }
        }
        catch (e) {
            this.debug('Could not parse input', this.contentOrUrl, e);
        }
    }
}
