const http = require('http');

async function testApi() {
  try {
    // 1. Register a test user to get a token
    const registerPayload = JSON.stringify({
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "password123"
    });

    console.log("Registering test user...");
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: registerPayload
    });
    
    const regData = await regRes.json();
    if (!regData.success) {
      throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    }
    
    const token = regData.token;
    console.log("Got JWT Token:", token.substring(0, 20) + "...");

    // 2. Test the Assistant Chat API
    console.log("Calling Assistant API...");
    const chatPayload = JSON.stringify({ message: "Hello" });
    
    const chatRes = await fetch('http://localhost:5000/api/assistant/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: chatPayload
    });

    const chatData = await chatRes.json();
    console.log("Assistant Response:", JSON.stringify(chatData, null, 2));

  } catch (error) {
    console.error("Test failed:", error);
  }
}

testApi();
