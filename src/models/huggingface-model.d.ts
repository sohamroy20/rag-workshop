import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';
export declare class HuggingFace extends BaseModel {
    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any>;
    private readonly debug;
    private readonly modelName;
    private readonly maxNewTokens;
    private readonly endpointUrl?;
    private model;
    constructor(params?: {
        modelName?: string;
        temperature?: number;
        maxNewTokens?: number;
        endpointUrl?: string;
    });
    init(): Promise<void>;
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string>;
}
