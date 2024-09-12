import createDebugMessages from 'debug';
// import { AzureOpenAI } from "@langchain/openai";
// import { AzureChatOpenAI } from "@langchain/azure-openai";
import { AzureChatOpenAI } from "@langchain/openai";
// import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
import { StringOutputParser } from '@langchain/core/output_parsers';
export class AzureChatAI extends BaseModel {
    constructor(params) {
        super(params?.temperature ?? 0.1);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('maap:model:AzureOpenAI')
        });
        Object.defineProperty(this, "azureOpenAIApiInstanceName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "azureOpenAIApiDeploymentName", {
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
        Object.defineProperty(this, "azureOpenAIApiVersion", {
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
        Object.defineProperty(this, "topP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "topK", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.azureOpenAIApiInstanceName = params?.azureOpenAIApiInstanceName;
        this.azureOpenAIApiDeploymentName = params?.azureOpenAIApiDeploymentName;
        this.azureOpenAIApiVersion = params?.azureOpenAIApiVersion;
        this.maxTokens = params?.maxTokens ?? 2048;
        this.topP = params?.topP ?? 0.9;
        this.topK = params?.topK ?? 40;
    }
    async init() {
        this.model = new AzureChatOpenAI({
            azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
            azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
            azureOpenAIApiVersion: this.azureOpenAIApiVersion,
            temperature: this.temperature,
            maxTokens: this.maxTokens,
            topP: this.topP
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('AzureOpenAI response -', result);
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
        this.debug('Executing AzureOpenAI model with prompt -', userQuery);
        return pastMessages;
    }
}
