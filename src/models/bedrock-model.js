import createDebugMessages from 'debug';
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
import { StringOutputParser } from '@langchain/core/output_parsers';
export class Bedrock extends BaseModel {
    constructor(params) {
        super(params?.temperature ?? 0.1);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('maap:model:Bedrock')
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
        this.model = new BedrockChat({ model: this.modelName,
            maxTokens: this.maxTokens,
            region: process.env.BEDROCK_AWS_REGION,
            credentials: {
                accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY,
            }
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Bedrock response -', result);
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
        this.debug('Executing Bedrock model with prompt -', userQuery);
        return pastMessages;
    }
}
