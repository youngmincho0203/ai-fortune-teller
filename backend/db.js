const mysql = require('mysql2');
const dotenv = require('dotenv');

// .env 파일에 있는 설정값 가져오기
dotenv.config();

// 1. 데이터베이스 연결 풀(Pool) 만들기
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // localhost
  user: process.env.DB_USER,       // root
  password: process.env.DB_PASS,   // 1123
  database: process.env.DB_NAME,   // fortune_db
  waitForConnections: true,
  connectionLimit: 10,             // 연결선 10개 유지
  queueLimit: 0
});

// Promise 방식으로 내보내기 (async/await 쓰려면 필수)
const db = pool.promise();

module.exports = db;