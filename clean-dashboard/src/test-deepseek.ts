import { testDeepSeekSearch, type SearchResult } from './services/deepseekService';

console.log('Starting DeepSeek API test...');

testDeepSeekSearch()
  .then((result: SearchResult) => {
    console.log('Test completed successfully!');
    console.log('Result:', result);
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });

export {}; 