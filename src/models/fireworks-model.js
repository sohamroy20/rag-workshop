import createDebugMessages from 'debug';
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { BaseModel } from '../interfaces/base-model.js';
export class Fireworks extends BaseModel {
    constructor(params) {
        super(params?.temperature ?? 0.1);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('maap:model:Fireworks')
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.modelName = params?.modelName ?? 'llama-v3-70b-instruct';
        this.apiKey = params?.apiKey ?? process.env.FIREWORKS_API_KEY;
        this.maxTokens = params?.maxTokens ?? 2048;
    }
    async init() {
        this.model = new ChatFireworks({ temperature: this.temperature, maxTokens: this.maxTokens, model: this.modelName, apiKey: this.apiKey });
    }
    generatePastMessages(system, supportingContext, pastConversations, userQuery) {
        const pastMessages = [
            new SystemMessage(`${system}. Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`),
        ];
        pastMessages.push.apply(pastMessages, pastConversations.map((c) => {
            if (c.sender === 'AI')
                return new AIMessage({ content: c.message });
            else if (c.sender === 'SYSTEM')
                return new SystemMessage({ content: c.message });
            else
                return new HumanMessage({ content: c.message });
        }));
        pastMessages.push(new HumanMessage(`${userQuery}?`));
        this.debug('Executing Fireworks model with prompt -', userQuery);
        return pastMessages;
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Fireworks response -', result);
        return result.content.toString();
    }
    async runStreamQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const parser = new StringOutputParser();
        const stream = await this.model.pipe(parser).stream(pastMessages);
        return stream;
    }
}
