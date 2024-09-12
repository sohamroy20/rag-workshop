import { Chunk, ConversationHistory } from '../global/types.js';
import { BaseModel } from '../interfaces/base-model.js';
export declare class VertexAI extends BaseModel {
    private readonly debug;
    private model;
    constructor(params?: {
        temperature?: number;
        modelName?: string;
        maxTokens?: number;
    });
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string>;
    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any>;
    private generatePastMessages;
}
