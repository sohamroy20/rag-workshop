import { BaseDb } from '../interfaces/base-db.js';
import { ExtractChunkData, InsertChunkData } from '../global/types.js';
/**
 * MongoDBAtlas class implements the BaseDb interface and provides methods for interacting with a MongoDB Atlas database.
 */
export declare class MongoDBAtlas implements BaseDb {
    private static readonly INDEX_NAME;
    private static readonly EMBEDDING_KEY;
    private static readonly TEXT_KEY;
    private readonly connectionString;
    private readonly dbName;
    private readonly collectionName;
    private readonly client;
    private readonly embeddingKey;
    private readonly textKey;
    private readonly indexName;
    private similarityFunction;
    private collection;
    private numCandidates;
    private minScore;
    /**
     * Constructs a new MongoDBAtlas instance.
     * @param connectionString The connection string for the MongoDB Atlas database.
     * @param dbName The name of the database.
     * @param collectionName The name of the collection.
     * @param embeddingKey The key for the embedding field in the collection documents. Default is "embedding".
     * @param textKey The key for the text field in the collection documents. Default is "text".
     * @param numCandidates The number of candidates to consider during similarity search. Default is 100.
     * @param similarityFunction The similarity function to use during similarity search.
     */
    constructor({ connectionString, dbName, collectionName, embeddingKey, textKey, indexName, numCandidates, similarityFunction, minScore }: {
        connectionString: string;
        dbName: string;
        collectionName: string;
        embeddingKey?: string;
        textKey?: string;
        indexName?: string;
        numCandidates: number;
        similarityFunction: string;
        minScore: number;
    });
    /**
     * Initializes the MongoDBAtlas instance by connecting to the database and setting the collection.
     */
    init(): Promise<void>;
    /**
     * Inserts chunks of data into the collection.
     * @param chunks An array of InsertChunkData objects representing the data to be inserted.
     * @returns A Promise that resolves to the number of chunks inserted.
     */
    insertChunks(chunks: InsertChunkData[]): Promise<number>;
    /**
     * Performs a similarity search using the given query vector.
     * @param query The query vector.
     * @param k The number of results to return.
     * @returns A Promise that resolves to an array of ExtractChunkData objects representing the search results.
     */
    similaritySearch(query: number[], k: number): Promise<ExtractChunkData[]>;
    /**
     * Generates the vector search query object.
     * @param searchVector The search vector.
     * @param k The number of candidates to consider.
     * @returns A Promise that resolves to the vector search query object.
     */
    getVectorSearchQuery(searchVector: number[], k: number): Promise<{}>;
    /**
     * Gets the count of vectors in the collection.
     * @returns A Promise that resolves to the number of vectors in the collection.
     */
    getVectorCount(): Promise<number>;
    /**
     * Deletes keys from the collection based on the unique loader ID.
     * @param uniqueLoaderId The unique loader ID.
     * @returns A Promise that resolves to a boolean indicating whether the keys were successfully deleted.
     */
    deleteKeys(uniqueLoaderId: string): Promise<boolean>;
    /**
     * Resets the collection by deleting all documents.
     * @returns A Promise that resolves when the collection has been reset.
     */
    reset(): Promise<void>;
    /**
     * Creates a vector index in the collection.
     * @param numDimensions The number of dimensions for the vector index.
     * @param similarityFunction The similarity function to use for the vector index. Default is "cosine".
     * @returns A Promise that resolves when the vector index has been created.
     */
    createVectorIndex(numDimensions: number, similarityFunction?: string): Promise<void>;
    docsCount(): Promise<number>;
}
