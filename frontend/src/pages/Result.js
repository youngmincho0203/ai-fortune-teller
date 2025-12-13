import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api"; 
import "./Result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = location.state || {}; 

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const hasFetched = useRef(false);

  const categoryNames = {
    money: "금전운",
    love: "연애운",
    work: "직업운",
    health: "건강운",
    total: "오늘의 종합운",
  };

  useEffect(() => {
    if (!category) {
      alert("잘못된 접근입니다!");
      navigate("/main");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    if (hasFetched.current) {
        return; 
    }
    
    hasFetched.current = true;

    const user = JSON.parse(storedUser);

    const fetchFortune = async () => {
      try {
        setLoading(true);
        const res = await api.post("/fortune", {
          userId: user.id,
          name: user.name,
          birthDate: user.birth_date,
          birthTime: user.birth_time,
          gender: user.gender,
          category: category,
        });
        setResult(res.data.result);
      } catch (err) {
        console.error(err);
        setError("운세를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchFortune();

  }, [category, navigate]);

  if (loading) {
    return (
      <div className="result-container">
        <div className="loading-box">
          <div className="spinner">🔮</div>
          <h2>AI가 천기누설 중...</h2>
          <p>잠시만 기다려주세요 (약 3초)</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-container">
        <div className="error-box">
          <h2>앗! 문제가 생겼어요 😢</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate("/main")}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="result-card">
        <div className="card-header">
          <span className="icon">
            {category === "total" ? "🌟" : "📜"}
          </span>
          <h2>{categoryNames[category] || "운세 결과"}</h2>
        </div>

        <div className="result-content">
          <p>{result}</p>
        </div>

        <button className="back-btn" onClick={() => navigate("/main")}>
          다른 운세 또 보기
        </button>
      </div>
    </div>
  );
}

export default Result;