const OpenAI = require('openai');
const dotenv = require('dotenv');

// .env 파일에서 API 키 꺼내오기
dotenv.config();

// OpenAI 연결 객체 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 금고(.env)에 넣어둔 키 사용
});

// 다른 파일(fortune.js)에서 쓸 수 있게 내보내기
module.exports = openai;