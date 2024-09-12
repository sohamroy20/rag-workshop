import createDebugMessages from 'debug';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
import { StringOutputParser } from '@langchain/core/output_parsers';
export class Anthropic extends BaseModel {
    constructor(params) {
        super(params?.temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('maap:model:Anthropic')
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
        this.modelName = params?.modelName ?? 'claude-3-sonnet-20240229';
        this.maxTokens = params?.maxTokens ?? 2048;
    }
    async init() {
        this.model = new ChatAnthropic({ temperature: this.temperature, model: this.modelName, maxTokens: this.maxTokens, apiKey: process.env.ANTHROPIC_API_KEY });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Anthropic response -', result);
        return result.content.toString();
    }
    runStreamQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const parser = new StringOutputParser();
        return this.model.pipe(parser).stream(pastMessages);
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
        this.debug('Executing anthropic model with prompt -', userQuery);
        return pastMessages;
    }
}
