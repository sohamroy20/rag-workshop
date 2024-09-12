import { Anthropic, BaseLoader, CohereEmbeddings, GeckoEmbedding, OpenAi, VertexAI, AdaEmbeddings } from '../../index.js';
import { MongoDBAtlas } from '../../vectorDb/mongo-db-atlas.js';
import { AnyscaleModel } from '../../models/anyscale-model.js';
import { Fireworks } from '../../models/fireworks-model.js';
import { Bedrock } from '../../models/bedrock-model.js';
import { TitanEmbeddings } from '../../embeddings/titan-embeddings.js';
import { NomicEmbeddingsv1 } from '../../embeddings/nomic-v1-embeddings.js';
import { NomicEmbeddingsv1_5 } from '../../embeddings/nomic-v1-5-embeddings.js';
import { AzureOpenAiEmbeddings } from '../../embeddings/azure-embeddings.js';
import { BedrockEmbedding } from '../../embeddings/bedrock-embeddings.js';
import { FireworksEmbedding } from '../../embeddings/fireworks-embeddings.js';
import { AzureChatAI } from '../../models/azureopenai-model.js';
export declare function getDatabaseConfig(): MongoDBAtlas;
/**
 Gets the DB info to use in the chatbot application
 */
export declare function getDatabaseConfigInfo(): {
    connectionString: string;
    dbName: string;
    collectionName: string;
    vectorSearchIndexName: string;
    minScore: any;
    numCandidates: any;
};
/**
 * Returns an instance of the model class based on the parsed data from a YAML file.
 * @returns An instance of the model class.
 */
export declare function getModelClass(): OpenAi | Anthropic | VertexAI | AzureChatAI | AnyscaleModel | Bedrock | Fireworks;
/**
 * Retrieves the embedding model based on the parsed data from a YAML file.
 * @returns The embedding model based on the parsed data.
 */
export declare function getEmbeddingModel(): NomicEmbeddingsv1_5 | AdaEmbeddings | CohereEmbeddings | GeckoEmbedding | AzureOpenAiEmbeddings | BedrockEmbedding | FireworksEmbedding | NomicEmbeddingsv1 | TitanEmbeddings;
/**
 * Returns the appropriate loader based on the parsed data from a YAML file.
 * @returns The loader object or null if no matching loader is found.
 */
export declare function getIngestLoader(): BaseLoader<Record<string, string | number | boolean>, Record<string, null>>[];
export declare function getStreamOptions(): {
    stream: any;
};
