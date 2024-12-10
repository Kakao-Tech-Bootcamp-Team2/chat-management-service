const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// OpenAI 환경변수 설정
process.env.OPENAI_API_KEY = 'test-key';

// OpenAI v4 모킹
const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'AI response' } }]
      })
    }
  }
};

// 생성자 함수로 모킹
function MockOpenAI() {
  return mockOpenAI;
}

jest.mock('openai', () => ({
  OpenAI: MockOpenAI
}));

// logger 모킹
jest.mock('../src/utils/logger', () => ({
  createLogger: (name) => ({
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  })
}));

let mongoServer;

// 테스트 전에 실행
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// 각 테스트 후에 실행
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// 모든 테스트 후에 실행
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}); 