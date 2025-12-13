import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  
  // true면 '로그인 모드', false면 '회원가입 모드'
  const [isLoginMode, setIsLoginMode] = useState(true);

  // 태어난 시간 '모름' 체크박스 상태
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);

  // 사용자가 입력한 모든 값을 저장하는 통 (State)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    birth_date: "",
    birth_time: "",
    gender: "male", // 성별 기본값은 남성으로 설정
  });

  // 입력창에 글자 칠 때마다 formData 업데이트하는 함수
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 버튼 눌렀을 때 실행되는 함수 (로그인 or 회원가입)
  const handleSubmit = async () => {
    try {
      if (isLoginMode) {
        /* =======================
           1. 로그인 모드일 때
           ======================= */
        const response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        // 성공하면 서버가 준 유저 정보(이름, 생년월일 등)를 브라우저에 저장!
        // (나중에 메인 화면에서 꺼내 쓸 거야)
        localStorage.setItem("user", JSON.stringify(response.data.user));

        alert(`${response.data.user.name}님 환영합니다!`);
        navigate("/main"); // 메인 화면으로 이동

      } else {
        /* =======================
           2. 회원가입 모드일 때
           ======================= */
        // '시간 모름'에 체크했으면 birth_time을 null로 보내기
        const dataToSend = {
          ...formData,
          birth_time: isTimeUnknown ? null : formData.birth_time,
        };

        await api.post("/auth/register", dataToSend);
        
        alert("회원가입 성공! 🎉 이제 로그인 해주세요.");
        setIsLoginMode(true); // 로그인 화면으로 자동 전환
      }

    } catch (error) {
      // 서버에서 보낸 에러 메시지 띄우기 (예: "비밀번호 틀렸습니다")
      alert(error.response?.data?.message || "오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isLoginMode ? "🔮 AI 사주풀이" : "📝 회원가입"}</h1>

        {/* [공통] 이메일 & 비밀번호 */}
        <div className="input-group">
          <input
            name="email"
            type="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* [회원가입 전용] 회원가입 모드일 때만 보여줌! */}
        {!isLoginMode && (
          <>
            <div className="input-group">
              <input
                name="name"
                type="text"
                placeholder="이름"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>생년월일</label>
              <input
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>태어난 시간</label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  name="birth_time"
                  type="time"
                  value={formData.birth_time}
                  onChange={handleChange}
                  disabled={isTimeUnknown} // 모름 체크하면 입력 못하게 막음
                />
                <label style={{ fontSize: "14px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isTimeUnknown}
                    onChange={(e) => setIsTimeUnknown(e.target.checked)}
                  />
                  모름
                </label>
              </div>
            </div>

            <div className="input-group">
              <label>성별</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </>
        )}

        {/* 실행 버튼 */}
        <button className="login-btn" onClick={handleSubmit}>
          {isLoginMode ? "로그인 하기" : "회원가입 완료"}
        </button>

        {/* 모드 전환 버튼 (글씨) */}
        <p className="toggle-text" onClick={() => setIsLoginMode(!isLoginMode)}>
          {isLoginMode ? "계정이 없으신가요? 회원가입" : "이미 계정이 있나요? 로그인"}
        </p>
      </div>
    </div>
  );
}

export default Login;