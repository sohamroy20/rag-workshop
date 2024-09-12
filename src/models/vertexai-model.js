import createDebugMessages from 'debug';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
import { StringOutputParser } from '@langchain/core/output_parsers';
export class VertexAI extends BaseModel {
    constructor(params) {
        super();
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('maap:model:VertexAI')
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new ChatVertexAI({
            maxOutputTokens: params?.maxTokens ?? 1024,
            temperature: params?.temperature ?? 0,
            model: params?.modelName ?? 'gemini-1.0-pro'
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('VertexAI response -', result);
        return result.content.toString();
    }
    runStreamQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const parser = new StringOutputParser();
        return this.model.pipe(parser).stream(pastMessages);
    }
    generatePastMessages(system, supportingContext, pastConversations, userQuery) {
        const systemString = system + '\n' + `Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`;
        const pastMessages = [new SystemMessage(systemString)];
        pastMessages.push.apply(pastMessages, pastConversations.map((c) => {
            if (c.sender === 'AI')
                return new AIMessage({ content: c.message });
            else if (c.sender === 'SYSTEM')
                return new SystemMessage({ content: c.message });
            else
                return new HumanMessage({ content: c.message });
        }));
        pastMessages.push(new HumanMessage(`${userQuery}?`));
        this.debug('Executing VertexAI model with prompt -', userQuery);
        return pastMessages;
    }
}
