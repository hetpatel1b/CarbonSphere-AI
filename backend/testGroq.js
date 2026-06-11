require('dotenv').config();
const groqService = require('./src/services/groqService');

async function test() {
  try {
    console.log("Checking health stats...", groqService.getHealthStats());
    
    console.log("Generating response 1 (Key 1)...");
    const res1 = await groqService.generateAssistantResponse("Say exactly 'Hello World 1'");
    console.log("Response 1:", res1);
    
    console.log("Generating response 2 (Key 2)...");
    const res2 = await groqService.generateAssistantResponse("Say exactly 'Hello World 2'");
    console.log("Response 2:", res2);
    
    console.log("Generating response 3 (Key 3 or loop back)...");
    const res3 = await groqService.generateAssistantResponse("Say exactly 'Hello World 3'");
    console.log("Response 3:", res3);
    
  } catch (error) {
    console.error("Test Error:", error);
  }
}

test();
