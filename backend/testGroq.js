require('dotenv').config();
const aiService = require('./src/services/aiService');

async function test() {
  try {
    console.log("Checking health...");
    await aiService.checkHealth();
    console.log("Generating response...");
    const res = await aiService.generateAssistantResponse("Say exactly 'Hello World'");
    console.log("Response:", res);
  } catch (error) {
    console.error("Test Error:", error);
  }
}

test();
