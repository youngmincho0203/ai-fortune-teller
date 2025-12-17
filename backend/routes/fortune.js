const express = require('express');
const router = express.Router();
const db = require('../db');
const openai = require('../utils/openai');

/* ===========================================
   AI 사주풀이 요청 API
   주소: POST /api/fortune
   =========================================== */
router.post('/', async (req, res) => {
  // 프론트에서 보낸 정보
  const { userId, name, birthDate, birthTime, gender, category } = req.body;

  // 오늘 날짜 구하기 (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  try {
    // ---------------------------------------------
    // 1단계: DB 캐싱 확인 (토큰 아끼기)
    // ---------------------------------------------
    const [existingRows] = await db.query(
      `SELECT * FROM fortune_logs 
       WHERE user_id = ? AND category = ? AND DATE(created_at) = ?`,
      [userId, category, today]
    );

    // 이미 오늘 본 기록이 있으면 DB에서 바로 반환
    if (existingRows.length > 0) {
      console.log(`[Cache Hit] DB에서 ${category} 운세 가져옴!`);
      return res.json({ 
        result: existingRows[0].content, 
        source: 'database' 
      });
    }

    // ---------------------------------------------
    // AI에게 요청하기 (OpenAI API)
    // ---------------------------------------------
    console.log(`[Cache Miss] AI에게 ${category} 운세 요청 중...`);

    // 태어난 시간/성별 문자열 정리
    const timeString = birthTime ? birthTime : "태어난 시간 모름";
    const genderString = gender === "male" ? "남성" : "여성";

    // 카테고리에 따라 AI한테 줄 프롬프트를 다르게 설정
    let categoryName = "";
    let specificInstruction = "";

    if (category === "total") {
        // 1. 종합운일 때
        categoryName = "오늘의 종합 운세";
        specificInstruction = "금전운, 연애운, 직업운, 건강운을 골고루 섞어서 오늘 하루의 전체적인 흐름을 이야기해줘.";
    } else {
        // 2. 일반 운세일 때 (영어 -> 한글 변환)
        const categoryMap = {
            money: "금전운",
            love: "연애운",
            work: "직업운",
            health: "건강운"
        };
        categoryName = categoryMap[category];
        specificInstruction = `다른 운세보다 특히 '${categoryName}'에 집중해서 자세히 풀이해줘.`;
    }

    // 프롬프트 조립
    const prompt = `
      너는 30년 경력의 정통 사주 명리학자야. 아래 사람의 '${categoryName}'을 봐줘.
      
      [사용자 정보]
      - 이름: ${name}
      - 성별: ${genderString}
      - 생년월일: ${birthDate}
      - 태어난 시간: ${timeString}
      
      [분석 요청사항]
      1. ${specificInstruction}
      2. 결과는 따뜻하고 친절한 존댓말을 사용해줘.
      3. 전문 용어(한자)를 남발하지 말고 쉬운 비유를 들어서 설명해줘.
      4. 답변 길이는 500자 내외로 적절하게 작성해줘.
      5. 마지막에는 오늘 이 사람에게 도움을 줄 수 있는 '행운의 아이템' 하나를 추천해줘.
      6. 마크다운 문법(볼드체 등)은 쓰지 말고 줄글로 써줘.
    `;

    // GPT 호출
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    const aiResult = completion.choices[0].message.content;

    // ---------------------------------------------
    // 결과 DB에 저장하기
    // ---------------------------------------------
    await db.query(
      `INSERT INTO fortune_logs (user_id, category, content) VALUES (?, ?, ?)`,
      [userId, category, aiResult]
    );

    // 결과 반환
    res.json({ 
      result: aiResult, 
      source: 'ai' 
    });

  } catch (error) {
    console.error("사주 요청 에러:", error);
    res.status(500).json({ message: "운세를 불러오는 중 문제가 발생했습니다." });
  }
});

module.exports = router;