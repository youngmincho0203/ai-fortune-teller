const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 라우터 가져오기
const authRoutes = require('./routes/auth');
const fortuneRoutes = require('./routes/fortune');

dotenv.config(); // 설정 파일(.env) 로딩

const app = express();
const PORT = process.env.PORT || 5000;

// 기본 세팅 (미들웨어)
app.use(cors()); // 리액트랑 통신 허용
app.use(express.json()); // JSON 데이터 해석

// /api/auth 로 시작하는 요청은 authRoutes(auth.js)가 처리
app.use('/api/auth', authRoutes);

// /api/fortune 으로 시작하는 요청은 fortuneRoutes(fortune.js)가 처리
app.use('/api/fortune', fortuneRoutes);

// 서버 켜기
app.listen(PORT, () => {
  console.log(`✅ 서버가 세팅되었습니다: http://localhost:${PORT}`);
});