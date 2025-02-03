import 'dotenv/config';
import {
    getModelClass,
    getEmbeddingModel,
    getDatabaseConfigInfo
} from '../../../src/yaml_parser/src/LoadYaml.js';
import {
    PreProcessQuery,
    RAGApplicationBuilder,
    Rerank,
    convertBaseEmbeddingsToEmbedder,
    convertBaseModelToChatLlm,
    withQueryPreprocessor,
    withReranker,
} from '../../../src/index.js';

import { MongoClient } from 'mongodb';
import {
    makeDefaultFindContent,
    MakeUserMessageFunc,
    OpenAiChatMessage,
    GenerateUserPromptFunc,
    makeRagGenerateUserPrompt,
    SystemPrompt,
    makeMongoDbConversationsService,
    AppConfig,
    makeApp,
} from 'mongodb-chatbot-server';
import { makeMongoDbEmbeddedContentStore, logger } from 'mongodb-rag-core';

// ✅ Load MAAP Base Classes
const model = getModelClass();
const embedding_model = getEmbeddingModel();
const { dbName, connectionString, vectorSearchIndexName, minScore, numCandidates } = getDatabaseConfigInfo();

// ✅ MongoDB Data Source for Embedded Content
const embeddedContentStore = makeMongoDbEmbeddedContentStore({
    connectionUri: connectionString,
    databaseName: dbName,
});

// ✅ Convert MAAP Base Embeddings to Embedder
const embedder = convertBaseEmbeddingsToEmbedder(embedding_model);
const llm = await convertBaseModelToChatLlm(model);

// ✅ Find Content in Embedded Store using Vector Search
const findContent = makeDefaultFindContent({
    embedder,
    store: embeddedContentStore,
    findNearestNeighborsOptions: {
        k: 5,
        path: 'embedding',
        indexName: vectorSearchIndexName,
        numCandidates: numCandidates,
        minScore: minScore,
    },
});

// ✅ MongoDB Client for Job Postings
const mongoClient = new MongoClient(connectionString);
await mongoClient.connect();
const db = mongoClient.db(dbName);
const jobCollection = db.collection("job_postings");

// ✅ Function to Fetch Job Postings from MongoDB

async function fetchJobsFromMongoDB(query: string, location?: string) {
    console.log(`🔍 Searching for jobs matching: "${query}" in "${location || 'Any Location'}"`);

    // 🔹 Extract meaningful keywords from user query
    const keywords = query.match(/\b[A-Za-z]+\b/g) || [];
    if (keywords.length === 0) {
        return "❌ Invalid job query. Please specify a job title, e.g., 'Software Engineer jobs in Remote'.";
    }

    // 🔹 Strict Title Matching (ALL words must exist in title)
    const strictTitleQuery = { title: { $all: keywords.map(word => new RegExp(`\\b${word}\\b`, "i")) } };

    // 🔹 Relaxed Title Matching (ANY keyword can exist in title)
    const relaxedTitleQuery = { title: { $regex: keywords.join("|"), $options: "i" } };

    // 🔹 Location Filter (if specified)
    const locationQuery = location ? { location: new RegExp(location, "i") } : {};

    console.log(`🧐 Using MongoDB Queries: \nStrict: ${JSON.stringify(strictTitleQuery)}\nRelaxed: ${JSON.stringify(relaxedTitleQuery)}\nLocation: ${JSON.stringify(locationQuery)}`);

    // 🔹 Connect to MongoDB
    const client = new MongoClient(connectionString);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("job_postings");

    // 🔹 Attempt **Strict Title + Location** Match First
    let jobListings = await collection.find({ ...strictTitleQuery, ...locationQuery }).limit(10).toArray();

    // 🔹 If no strict matches, try **Relaxed Title + Location** Match
    if (jobListings.length === 0) {
        console.log("🔄 No strict matches found. Trying relaxed keyword search...");
        jobListings = await collection.find({ ...relaxedTitleQuery, ...locationQuery }).limit(10).toArray();
    }

    // 🔹 If still no matches, try **Only Title (No Location Filter)**
    if (jobListings.length === 0) {
        console.log("🔄 No location matches. Trying title-only search...");
        jobListings = await collection.find(strictTitleQuery).limit(10).toArray();
    }

    // 🔹 Close DB connection
    await client.close();

    console.log(`✅ Jobs Found: ${jobListings.length}`);
    console.log(`📜 Matching Jobs:`, jobListings);

    if (jobListings.length === 0) {
        return "❌ No job listings found matching your query.";
    }

    return jobListings
        .map(job => `🔹 **${job.title}** at **${job.company}** - *${job.location}*\n🔗 [Apply Here](${job.link})`)
        .join("\n\n");
}




// ✅ Detect if Query is Job-Related
function isJobQuery(message: string): boolean {
    const jobKeywords = ["job", "jobs", "role", "roles", "position", "positions", "vacancy", "vacancies", "hiring","openings"];
    return jobKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

// ✅ User Message Processing (Modified)
const makeUserMessage: MakeUserMessageFunc = async function ({ content, originalUserMessage }) {
    const chunkSeparator = '~~~~~~';

    // 🔍 Extract Job Query & Location
    const jobMatch = originalUserMessage.match(/(?:jobs|roles|positions|openings) for (.+?)(?: in (.+))?$/i);
    const jobTitle = jobMatch ? jobMatch[1].trim() : "";
    const location = jobMatch && jobMatch[2] ? jobMatch[2].trim() : "";

    // ✅ If user asks about jobs, fetch from MongoDB
    if (jobTitle) {
        const jobs = await fetchJobsFromMongoDB(jobTitle, location);
        return { role: 'user', content: jobs };
    }

    // ✅ Normal Behavior for Other Queries
    const context = content.map((c) => c.text).join(`\n${chunkSeparator}\n`);
    const contentForLlm = `Using the following information, answer the user query.

Information:
${context}

User query: ${originalUserMessage}`;
    return { role: 'user', content: contentForLlm };
};


// ✅ Generates the User Prompt for Chatbot (Fixed)
const generateUserPrompt: GenerateUserPromptFunc = makeRagGenerateUserPrompt({
    findContent,
    makeUserMessage,
});

// ✅ System Prompt for Chatbot
const systemPrompt: SystemPrompt = {
    role: 'system',
    content: `You are a chatbot designed to help with information about Basel and job opportunities. 
    If a user asks about jobs, fetch and return the latest job postings stored in job_postings. 
    If the user asks something else, provide answers based on available data in the database.`,
};

// ✅ MongoDB Conversations Service
const conversations = makeMongoDbConversationsService(db);

// ✅ Create Chatbot Server Configuration
const config: AppConfig = {
    conversationsRouterConfig: {
        llm,
        conversations,
        generateUserPrompt,
        systemPrompt,
    },
    maxRequestTimeoutMs: 30000,
    serveStaticSite: true,
};

// ✅ Start the Chatbot Server
const PORT = process.env.PORT || 9000;
const startServer = async () => {
    logger.info('Starting server...');
    const app = await makeApp(config);
    const server = app.listen(PORT, () => {
        logger.info(`✅ Server listening on port: ${PORT}`);
    });

    process.on('SIGINT', async () => {
        logger.info('SIGINT signal received');
        await mongoClient.close();
        await embeddedContentStore.close();
        await new Promise<void>((resolve, reject) => {
            server.close((error: any) => {
                error ? reject(error) : resolve();
            });
        });
        process.exit(1);
    });
};

try {
    startServer();
} catch (e) {
    logger.error(`❌ Fatal error: ${e}`);
    process.exit(1);
}
