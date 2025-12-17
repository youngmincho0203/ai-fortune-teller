const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

/* ==========================
   1. 회원가입 API
   주소: POST /api/auth/register
   ========================== */
router.post('/register', async (req, res) => {
  // 프론트엔드에서 보낸 정보들을 꺼냄
  const { email, password, name, birth_date, birth_time, gender } = req.body;

  console.log(email);

  try {
    // [1] 이메일 중복 체크
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // [2] 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // [3] DB에 저장 (시간이 없으면 null로 저장)
    // birth_time이 빈 문자열('')이거나 undefined면 null로 바꿔주는 로직 포함
    const timeValue = birth_time ? birth_time : null;

    await db.query(
      'INSERT INTO users (email, password, name, birth_date, birth_time, gender) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, name, birth_date, timeValue, gender]
    );

    res.status(201).json({ message: '회원가입 성공! 로그인해주세요.' });

  } catch (error) {
    console.error('회원가입 에러:', error);
    // 디버깅을 위해 에러 내용을 직접 보여줍니다.
    res.status(500).json({ message: `서버 에러: ${error.message}` });
  }
});

/* ==========================
   2. 로그인 API
   주소: POST /api/auth/login
   ========================== */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // [1] 이메일로 사용자 찾기
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    // 유저가 없으면?
    if (users.length === 0) {
      return res.status(401).json({ message: '가입되지 않은 이메일입니다.' });
    }

    const user = users[0];

    // [2] 비밀번호 확인 (bcrypt가 암호화된 거랑 비교)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
    }

    // [3] 로그인 성공! (비밀번호 빼고 나머지 정보만 돌려줌)
    const { password: _, ...userData } = user;

    res.json({ message: '로그인 성공!', user: userData });

  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '서버 에러' }); //로그인시 에러로 바로 들어와짐
  }
});

module.exports = router;