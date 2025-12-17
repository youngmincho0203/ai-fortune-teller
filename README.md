# ai-fortune-teller
로그인 화면 -> 메인 화면 -> 결과 화면

사주볼 때 필요한 요소 : 생년 월 일 시 성별
시 : 현실적인 문제 - 모르는 사람 많음 -> 모름 옵션 주기 + 프롬프트에 모름 적용

메인화면 생년월일 연동 - 수정이 가능할 경우 -> db요소 추가 + 매번 생년월일 비교 로직 -> 의도 : ai 토큰 아끼기 위해 db 사용과 안맞음

로그인 : 이메일 비밀번호 이름 생년월일 시간(모름 옵션) 성별

이렇게 다 만들면 메인화면 가벼워지지 않을까요?
메인화면에서 수정 불가능하게 하는게 만들기 쉽지 않을까요?

일정(27) : db 테이블 만들기 -> auth.js(로그인/회원가입) -> Login.js, Login.css +++ 메인화면 구상, 다음주 발표ppt
일정(4) : backend/utils/openai.js(apikey), backend/routes/fortune.js(prompt수정)
일정(18) : 발표 - 11:50

완료(27) : db 테이블, backend/routes/auth.js, frontend/api.js, frontend/app.js
완료(28) : frontend/pages/login.js, frontend/pages/login.css, backend/db.js
완료(12) : frontend/pages/fortuneMain.css, frontend/pages/fortuneMain.js
완료(13) : frontend/pages/result.css, frontend/pages/result.js

실행
cd backend
npx nodemon server.js
cd frontend
npm start

mysql
/* 1. 데이터베이스(창고) 만들기 - 이름: fortune_db */
CREATE DATABASE IF NOT EXISTS fortune_db;

/* 2. 방금 만든 창고 안으로 들어가기 */
USE fortune_db;

/* 3. 혹시 기존에 잘못 만든 테이블이 있으면 삭제 (완성되면 코드 삭제) */
DROP TABLE IF EXISTS fortune_logs;
DROP TABLE IF EXISTS users;

/* 4. 사용자(users) 테이블 만들기 */
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,     -- 고유 번호
    email VARCHAR(100) NOT NULL UNIQUE,    -- 이메일 (아이디)
    password VARCHAR(255) NOT NULL,        -- 비밀번호 (암호화됨)
    name VARCHAR(50) NOT NULL,             -- 이름
    birth_date DATE NOT NULL,              -- 생년월일 (YYYY-MM-DD)
    birth_time TIME NULL,                  -- 태어난 시간 (모르면 비워둘 수 있게 NULL 허용)
    gender VARCHAR(10) NOT NULL,           -- 성별 ('male' 또는 'female')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 가입일
);

/* 5. 사주 기록(fortune_logs) 테이블 만들기 */
CREATE TABLE fortune_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                  -- 누구의 사주인지
    category VARCHAR(50) NOT NULL,         -- 운세 종류 (money, love 등)
    content TEXT NOT NULL,                 -- AI가 써준 내용 (아주 기니까 TEXT)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 언제 봤는지
    FOREIGN KEY (user_id) REFERENCES users(id) -- users 테이블이랑 연결
);


backend/
├── .env                  # [설정] DB 접속 정보 및 OpenAI API 키 저장
├── server.js             # [진입점] 서버 실행 및 전체 라우팅 설정
├── db.js                 # [DB] MySQL 데이터베이스 연결 설정
├── routes/
│   ├── auth.js           # [API] 회원가입, 로그인 처리 로직
│   └── fortune.js        # [API] 사주 요약 요청, DB 캐싱, AI 연동 로직
└── utils/
    └── openai.js         # [도구] OpenAI API 연결 객체 설정

frontend/src/
├── api.js                # [통신] Axios 설정 (Backend와 통신하는 기본 주소 설정)
├── App.js                # [라우팅] 페이지 이동 경로 설정 (Login <-> Main <-> Result)
└── pages/
    ├── Login.js          # [화면] 로그인 및 회원가입 페이지
    ├── Login.css         # [스타일] 로그인 페이지 디자인
    ├── FortuneMain.js    # [화면] 메인 대시보드 (사용자 정보, 운세 선택)
    ├── FortuneMain.css   # [스타일] 메인 페이지 디자인
    ├── Result.js         # [화면] 운세 결과 페이지
    └── Result.css        # [스타일] 결과 페이지 디자인



1. Users 테이블 (사용자 정보)
역할: 회원가입 시 입력된 개인정보를 영구 저장하며, 사주 분석의 기초 데이터로 활용.

id (PK, INT): 사용자 고유 식별자 (Auto Increment).
email (VARCHAR, Unique): 로그인 ID (중복 불가).
password (VARCHAR): bcrypt로 암호화된 비밀번호.
name (VARCHAR): 사용자 이름.
birth_date (DATE): 생년월일 (사주 핵심 데이터).
birth_time (TIME): 태어난 시간 (정확도 향상용, NULL 허용).
gender (VARCHAR): 성별 (남/여).

2. FortuneLogs 테이블 (운세 기록)
역할: AI가 생성한 운세 결과를 저장하여 중복 API 호출 방지.

id (PK, INT): 로그 고유 식별자.
user_id (FK, INT): Users 테이블의 id 참조 (Foreign Key).
category (VARCHAR): 운세 종류 (money, love, work, health, total).
content (TEXT): AI가 생성한 운세 분석 텍스트.
created_at (TIMESTAMP): 생성 일시 (당일 중복 조회 체크용).