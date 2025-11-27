# ai-fortune-teller
로그인 화면 -> 메인 화면 -> 결과 화면

사주볼 때 필요한 요소 : 생년 월 일 시 성별
시 : 현실적인 문제 - 모르는 사람 많음 -> 모름 옵션 주기 + 프롬프트에 모름 적용

메인화면 생년월일 연동 - 수정이 가능할 경우 -> db요소 추가 + 매번 생년월일 비교 로직 -> 의도 : ai 토큰 아끼기 위해 db 사용과 안맞음

로그인 : 이메일 비밀번호 이름 생년월일 시간(모름 옵션) 성별

이렇게 다 만들면 메인화면 가벼워지지 않을까요?
메인화면에서 수정 불가능하게 하는게 만들기 쉽지 않을까요?

일정(27) : db 테이블 만들기 -> auth.js(로그인/회원가입) -> Login.js, Login.css +++ 메인화면 다음주 발표ppt

완료(27) : db 테이블, auth.js
예정(28) : api.js app.js login.js login.css db.js



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