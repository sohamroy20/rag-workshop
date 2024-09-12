import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';
export declare class Fireworks extends BaseModel {
    private readonly debug;
    private readonly modelName;
    private readonly maxTokens;
    private apiKey;
    private model;
    constructor(params?: {
        temperature?: number;
        maxTokens?: number;
        modelName?: string;
        apiKey?: string;
    });
    init(): Promise<void>;
    private generatePastMessages;
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string>;
    runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any>;
}
