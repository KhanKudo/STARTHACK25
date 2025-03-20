import { testDeepSeekAPI } from './services/deepseekService';

interface TestResponse {
  matchingIds: string[];
  explanation: string;
}

console.log('Starting DeepSeek API test...');

testDeepSeekAPI()
  .then((result: TestResponse) => {
    console.log('API test completed successfully!');
    console.log('Final result:', result);
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error('API test failed:', error);
    process.exit(1);
  });

export {}; 