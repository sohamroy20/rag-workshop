import createDebugMessages from 'debug';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
export class OpenAi extends BaseModel {
    runStreamQuery(system, userQuery, supportingContext, pastConversations) {
        throw new Error('Method not implemented.');
    }
    constructor(params) {
        super(params?.temperature ?? 0.1);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('maap:model:OpenAi')
        });
        Object.defineProperty(this, "modelName", {
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
        this.modelName = params?.modelName ?? 'gpt-3.5-turbo';
    }
    async init() {
        this.model = new ChatOpenAI({ temperature: this.temperature, model: this.modelName });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
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
        const result = await this.model.invoke(pastMessages);
        this.debug('OpenAI response -', result);
        return result.content.toString();
    }
}
