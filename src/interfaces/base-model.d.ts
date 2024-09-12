import { Chunk, ConversationHistory } from '../global/types.js';
export declare abstract class BaseModel {
    private readonly baseDebug;
    private static defaultTemperature;
    static setDefaultTemperature(temperature?: number): void;
    private readonly conversationMap;
    private readonly _temperature?;
    constructor(temperature?: number);
    get temperature(): number;
    init(): Promise<void>;
    query(system: string, userQuery: string, supportingContext: Chunk[], conversationId?: string): Promise<string>;
    queryStream(system: string, userQuery: string, supportingContext: Chunk[], conversationId?: string): Promise<any>;
    protected abstract runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string>;
    protected abstract runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any>;
}
