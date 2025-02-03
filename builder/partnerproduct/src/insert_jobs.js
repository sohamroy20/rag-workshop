import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = "mongodb+srv://soham:Password@ragunibas.6zyci.mongodb.net/";
const DB_NAME = "chatter";
const COLLECTION_NAME = "job_postings";

async function insertJobs() {
    console.log("📦 Inserting job postings into MongoDB...");

    // Read job_postings.json
    const filePath = path.join(__dirname, "job_postings.json");
    if (!fs.existsSync(filePath)) {
        console.error("❌ job_postings.json not found!");
        return;
    }

    const jobs = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!jobs.length) {
        console.error("❌ No jobs found in job_postings.json.");
        return;
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Insert jobs
    for (const job of jobs) {
        const exists = await collection.findOne({ title: job.title, company: job.company });
        if (!exists) {
            await collection.insertOne(job);
        }
    }

    console.log("✅ Jobs successfully inserted into MongoDB!");
    await client.close();
}

// Run the function
insertJobs().catch(console.error);
