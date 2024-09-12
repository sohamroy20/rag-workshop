import createDebugMessages from 'debug';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
import { StringOutputParser } from '@langchain/core/output_parsers';
export class AnyscaleModel extends BaseModel {
    constructor(params) {
        super(params?.temperature ?? 0.1);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('maap:model:AnyscaleLLM')
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
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.modelName = params?.modelName;
        this.maxTokens = params?.maxTokens ?? 2048;
    }
    async init() {
        this.model = new ChatOpenAI({ temperature: this.temperature, maxTokens: this.maxTokens, model: this.modelName, apiKey: process.env.ANYSCALE_API_KEY, configuration: { baseURL: process.env.ANYSCALE_BASE_URL }
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('OpenAI response -', result);
        return result.content.toString();
    }
    runStreamQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const parser = new StringOutputParser();
        return this.model.pipe(parser).stream(pastMessages);
    }
    generatePastMessages(system, supportingContext, pastConversations, userQuery) {
        const pastMessages = [new SystemMessage(system)];
        pastMessages.push(new SystemMessage(`Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`));
        pastMessages.push.apply(pastMessages, pastConversations.map((c) => {
            if (c.sender === 'AI')
                return new AIMessage({ content: c.message });
            else if (c.sender === 'SYSTEM')
                return new SystemMessage({ content: c.message });
            else
                return new HumanMessage({ content: c.message });
        }));
        pastMessages.push(new HumanMessage(`${userQuery}?`));
        this.debug('Executing openai model with prompt -', userQuery);
        return pastMessages;
    }
}
