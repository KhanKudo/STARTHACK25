import fetch from 'node-fetch';

const DEEPSEEK_API_KEY = 'sk-108d8076bfe54f9ab5695d8f3f2576d6';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function testDeepSeekAPI() {
  try {
    console.log('Testing DeepSeek API connection...');
    console.log('API URL:', DEEPSEEK_API_URL);
    console.log('API Key present:', !!DEEPSEEK_API_KEY);

    const simplePrompt = `Return ONLY a JSON object (no markdown, no code blocks) with:
    - matchingIds: ["test1"]
    - explanation: "This is a test response"
    
    The response should be a raw JSON object, not wrapped in any code blocks or other formatting.`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: simplePrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(`DeepSeek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API Response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from DeepSeek API');
    }

    const content = data.choices[0].message.content;
    console.log('Response content:', content);

    try {
      // Remove any markdown code block markers if present
      const cleanContent = content.replace(/```[a-z]*\n|\n```/g, '');
      const parsedContent = JSON.parse(cleanContent);
      console.log('Parsed content:', parsedContent);
      return parsedContent;
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Failed to parse DeepSeek API response as JSON');
    }
  } catch (error) {
    console.error('API test failed:', error);
    throw error;
  }
}

// Run the test
console.log('Starting DeepSeek API test...');

testDeepSeekAPI()
  .then(result => {
    console.log('API test completed successfully!');
    console.log('Final result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('API test failed:', error);
    process.exit(1);
  }); 