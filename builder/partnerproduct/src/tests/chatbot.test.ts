// // builder/partnerproduct/src/tests/chatbot.test.ts

// import { expect } from 'chai';
// import { Chatbot } from '../chatbot';
// import { AdaEmbeddings } from '../embeddings';
// import { OpenAI } from '../llms';
// import { MongoClient } from 'mongodb';
// import sinon from 'sinon';

// describe('Chatbot', () => {
//   let chatbot: Chatbot;
//   let mockGenerateResponse: sinon.SinonStub;
//   let mockConnect: sinon.SinonStub;
//   let mockDb: any;

//   beforeEach(() => {
//     chatbot = new Chatbot();
//     mockGenerateResponse = sinon.stub(OpenAI.prototype, 'generateResponse');
//     mockConnect = sinon.stub(MongoClient.prototype, 'connect');
//     mockDb = {
//       collection: sinon.stub().returns({
//         find: sinon.stub().returns({
//           toArray: sinon.stub().resolves([]),
//         }),
//       }),
//     };
//     mockConnect.resolves(mockDb);
//   });

//   afterEach(() => {
//     sinon.restore();
//   });

//   it('should return a response from the LLM', async () => {
//     mockGenerateResponse.resolves('Hello, how can I help you?');

//     const response = await chatbot.getResponse('Hi');
//     expect(response).to.equal('Hello, how can I help you?');
//   });

//   it('should connect to the database', async () => {
//     await chatbot.connectToDb();
//     expect(mockConnect.calledOnce).to.be.true;
//     expect(mockDb.collection.calledWith('embedded_content')).to.be.true;
//   });
// });