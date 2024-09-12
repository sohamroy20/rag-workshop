import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { YoutubeTranscript } from 'youtube-transcript';
import createDebugMessages from 'debug';
import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString } from '../util/strings.js';
export class YoutubeLoader extends BaseLoader {
    constructor({ videoIdOrUrl, chunkSize, chunkOverlap, }) {
        super(`YoutubeLoader_${md5(videoIdOrUrl)}`, chunkSize ?? 2000, chunkOverlap ?? 100);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('maap:loader:YoutubeLoader')
        });
        Object.defineProperty(this, "videoIdOrUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.videoIdOrUrl = videoIdOrUrl;
    }
    async *getUnfilteredChunks() {
        const chunker = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });
        try {
            // const transcripts = await YoutubeTranscript.fetchTranscript(this.videoIdOrUrl, { lang: 'en' });
            const transcripts = await YoutubeTranscript.fetchTranscript(this.videoIdOrUrl);
            console.log(`Transcripts (length ${transcripts.length}) obtained for video`, this.videoIdOrUrl);
            // Consolidate all transcripts into one string to be split into larger chunks
            const overallTranscript = transcripts.reduce((accumulator, transcript) => {
                return accumulator + transcript.text;
            }, '');
            // Split the overall transcript into chunks
            for (const chunk of await chunker.splitText(cleanString(overallTranscript))) {
                yield {
                    pageContent: chunk,
                    metadata: {
                        type: 'YoutubeLoader',
                        source: this.videoIdOrUrl,
                    },
                };
            }
        }
        catch (e) {
            this.debug('Could not get transcripts for video', this.videoIdOrUrl, e);
        }
    }
}
