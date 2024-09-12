import { Chunk, ConversationHistory } from '../global/types.js';
import { BaseModel } from '../interfaces/base-model.js';
export declare class Ollama extends BaseModel {
    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any>;
    private readonly debug;
    private model;
    constructor({ baseUrl, temperature, modelName }: {
        baseUrl?: string;
        temperature?: number;
        modelName?: string;
    });
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string>;
}
