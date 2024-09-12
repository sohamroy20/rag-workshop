import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';
export declare class OpenAi extends BaseModel {
    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any>;
    private readonly debug;
    private readonly modelName;
    private model;
    constructor(params?: {
        temperature?: number;
        modelName?: string;
    });
    init(): Promise<void>;
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string>;
}
