// // builder/partnerproduct/src/chatbot.ts
// console.log("✅ chatbot.ts is loaded and running!");

// import { AdaEmbeddings } from "./embeddings.js";
// import { OpenAI } from "./llms.js";
// import { MongoClient } from 'mongodb';

// export class Chatbot {
//   private embeddings: AdaEmbeddings;
//   private llm: OpenAI;
//   private dbClient: MongoClient;

//   constructor() {
//     this.embeddings = new AdaEmbeddings();
//     this.llm = new OpenAI();
//     this.dbClient = new MongoClient('mongodb+srv://soham:Password@ragunibas.6zyci.mongodb.net/');
//   }

//   async getResponse(input: string): Promise<string> {
//     // Implementation here
//     return 'Hello, how can I help you?';
//   }

//   async connectToDb(): Promise<void> {
//     await this.dbClient.connect();
//     const db = this.dbClient.db('chatter');
//     const collection = db.collection('embedded_content');
//     // Implementation here
//   }}
