import { MongoClient } from "mongodb";
/**
 * MongoDBAtlas class implements the BaseDb interface and provides methods for interacting with a MongoDB Atlas database.
 */
export class MongoDBAtlas {
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
    constructor({ connectionString, dbName, collectionName, embeddingKey = MongoDBAtlas.EMBEDDING_KEY, textKey = MongoDBAtlas.TEXT_KEY, indexName = MongoDBAtlas.INDEX_NAME, numCandidates = 100, similarityFunction, minScore = 0.1 }) {
        Object.defineProperty(this, "connectionString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dbName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collectionName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "embeddingKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "textKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "indexName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "similarityFunction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "numCandidates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "minScore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.connectionString = connectionString;
        this.dbName = dbName;
        this.collectionName = collectionName;
        this.client = new MongoClient(this.connectionString);
        this.embeddingKey = embeddingKey;
        this.textKey = textKey;
        this.indexName = indexName;
        this.similarityFunction = similarityFunction;
        this.numCandidates = numCandidates;
        this.minScore = minScore;
    }
    /**
     * Initializes the MongoDBAtlas instance by connecting to the database and setting the collection.
     */
    async init() {
        this.collection = this.client.db(this.dbName).collection(this.collectionName);
    }
    /**
     * Inserts chunks of data into the collection.
     * @param chunks An array of InsertChunkData objects representing the data to be inserted.
     * @returns A Promise that resolves to the number of chunks inserted.
     */
    async insertChunks(chunks) {
        const mapped = chunks.map((chunk) => {
            return {
                chunkIndex: chunk.metadata.id,
                [this.textKey]: chunk.pageContent,
                embedding: chunk.vector,
                metadata: chunk.metadata,
                sourceName: chunk.metadata.originalSource,
                url: chunk.metadata.source,
            };
        });
        await this.collection.insertMany(mapped);
        return mapped.length;
    }
    /**
     * Performs a similarity search using the given query vector.
     * @param query The query vector.
     * @param k The number of results to return.
     * @returns A Promise that resolves to an array of ExtractChunkData objects representing the search results.
     */
    async similaritySearch(query, k) {
        const query_object = [await this.getVectorSearchQuery(query, k), { "$project": { "_id": 0, "score": { "$meta": "vectorSearchScore" }, "text": 1, "metadata": 1 } }, { "$match": { "score": { "$gt": this.minScore } } }];
        const results = await this.collection.aggregate(query_object).toArray();
        return results.map((result) => {
            const pageContent = result[this.textKey];
            delete result.metadata.pageContent;
            return {
                score: result.score,
                pageContent,
                metadata: result.metadata,
            };
        });
    }
    /**
     * Generates the vector search query object.
     * @param searchVector The search vector.
     * @param k The number of candidates to consider.
     * @returns A Promise that resolves to the vector search query object.
     */
    async getVectorSearchQuery(searchVector, k) {
        return {
            "$vectorSearch": {
                "index": this.indexName,
                "path": this.embeddingKey,
                "queryVector": searchVector,
                "numCandidates": this.numCandidates,
                "limit": k
            }
        };
    }
    /**
     * Gets the count of vectors in the collection.
     * @returns A Promise that resolves to the number of vectors in the collection.
     */
    async getVectorCount() {
        return this.collection.countDocuments();
    }
    /**
     * Deletes keys from the collection based on the unique loader ID.
     * @param uniqueLoaderId The unique loader ID.
     * @returns A Promise that resolves to a boolean indicating whether the keys were successfully deleted.
     */
    async deleteKeys(uniqueLoaderId) {
        await this.collection.deleteOne({
            "$match": {
                "id": uniqueLoaderId,
            }
        });
        return true;
    }
    /**
     * Resets the collection by deleting all documents.
     * @returns A Promise that resolves when the collection has been reset.
     */
    async reset() {
        this.collection.deleteMany({});
    }
    /**
     * Creates a vector index in the collection.
     * @param numDimensions The number of dimensions for the vector index.
     * @param similarityFunction The similarity function to use for the vector index. Default is "cosine".
     * @returns A Promise that resolves when the vector index has been created.
     */
    async createVectorIndex(numDimensions, similarityFunction) {
        try {
            this.similarityFunction = similarityFunction ?? "cosine";
            const index = {
                name: this.indexName,
                type: "vectorSearch",
                definition: {
                    "fields": [
                        {
                            "type": "vector",
                            "numDimensions": numDimensions,
                            "path": this.embeddingKey,
                            "similarity": this.similarityFunction
                        }
                    ]
                }
            };
            await this.collection.createSearchIndex(index);
            console.log("\n-- Vector index created --");
        }
        catch (e) {
            return Promise.reject(e.codeName);
        }
    }
    async docsCount() {
        try {
            const docsCount = await this.client.db(this.dbName).collection(this.collectionName).estimatedDocumentCount();
            return docsCount;
        }
        catch (e) {
            return 0;
        }
    }
}
Object.defineProperty(MongoDBAtlas, "INDEX_NAME", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "vector_index"
});
Object.defineProperty(MongoDBAtlas, "EMBEDDING_KEY", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "embedding"
});
Object.defineProperty(MongoDBAtlas, "TEXT_KEY", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "text"
});
