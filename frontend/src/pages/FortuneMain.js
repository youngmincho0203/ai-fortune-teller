import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FortuneMain.css";

function FortuneMain() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("로그인이 필요합니다!");
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleSelect = (category) => {
    navigate("/result", { state: { category: category } });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // 날짜 변환 함수 (YYYY년 MM월 DD일)
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  // 띠 계산 함수
  const getZodiac = (birthDate) => {
    if (!birthDate) return "";
    const year = new Date(birthDate).getFullYear();
    const zodiacs = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];
    return zodiacs[year % 12];
  };

  if (!user) return null;

  return (
    <div className="main-container">
      {/* 1. 상단 정보 영역 */}
      <div className="header-box">
        <h1>📜 {user.name}님의 사주</h1>
        <p className="birth-info">
           <span role="img" aria-label="birth" style={{ marginRight: "6px" }}>🎂</span>
           {formatDate(user.birth_date)} 
           
           <span className="gender-badge">
             {getZodiac(user.birth_date)}띠 | {user.gender === "male" ? "남성" : "여성"}
           </span>
        </p>
      </div>

      {/* 2. 운세 목록 (버튼 영역) */}
      <div className="menu-list">
        <button className="menu-item money" onClick={() => handleSelect("money")}>
          <div className="menu-left">
            <span className="icon">💰</span> 
            <span className="text">금전운</span>
          </div>
          <span className="arrow">👉</span>
        </button>

        <button className="menu-item love" onClick={() => handleSelect("love")}>
          <div className="menu-left">
            <span className="icon">💘</span> 
            <span className="text">연애운</span>
          </div>
          <span className="arrow">👉</span>
        </button>

        <button className="menu-item work" onClick={() => handleSelect("work")}>
          <div className="menu-left">
            <span className="icon">💼</span> 
            <span className="text">직업운</span>
          </div>
          <span className="arrow">👉</span>
        </button>

        <button className="menu-item health" onClick={() => handleSelect("health")}>
          <div className="menu-left">
            <span className="icon">💪</span> 
            <span className="text">건강운</span>
          </div>
          <span className="arrow">👉</span>
        </button>

        {/* 종합운 강조 */}
        <button className="menu-item total" onClick={() => handleSelect("total")}>
          <div className="menu-left">
            <span className="icon">🌟</span> 
            <span className="text">오늘의 종합운</span>
          </div>
          <span className="arrow">✨</span>
        </button>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default FortuneMain;