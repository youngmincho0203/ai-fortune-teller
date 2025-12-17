import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Result from "./Result"; // 팝업 컴포넌트 불러오기
import "./FortuneMain.css";

function FortuneMain() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("방문자");

    // 팝업 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserName(user.name);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        alert("로그아웃 되었습니다.");
        navigate("/");
    };

    const handleFortuneClick = (type) => {
        // 1. 팝업 제목 설정
        setModalTitle(type);

        // 2. 팝업 내용 설정 (나중엔 AI 결과로 대체)
        setModalContent(`${userName}님의 2024년 ${type} 결과입니다.\n\n아직 AI 기능이 연결되지 않아 임시 텍스트가 표시됩니다.\n곧 멋진 운세 기능이 추가될 예정입니다! ✨`);

        // 3. 팝업 열기
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="fortune-container">
            <div className="fortune-box">
                <div className="welcome-text">
                    안녕하세요, <span className="user-name">{userName}</span>님!<br />
                    오늘 어떤 운세가 궁금하신가요?
                </div>

                <div className="button-grid">
                    <button className="fortune-btn" onClick={() => handleFortuneClick("진로운")}>
                        🌅 진로운
                    </button>
                    <button className="fortune-btn" onClick={() => handleFortuneClick("연애운")}>
                        💘 연애운
                    </button>
                    <button className="fortune-btn" onClick={() => handleFortuneClick("금전운")}>
                        💰 금전운
                    </button>
                    <button className="fortune-btn" onClick={() => handleFortuneClick("건강운")}>
                        💪 건강운
                    </button>
                    <button className="fortune-btn" onClick={() => handleFortuneClick("이번 주 운세")}>
                        🔮 이번 주 운세 보기
                    </button>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    로그아웃
                </button>
            </div>

            {/* 팝업창 컴포넌트 (평소엔 숨겨져 있음) */}
            <Result
                isOpen={isModalOpen}
                onClose={closeModal}
                title={modalTitle}
                content={modalContent}
            />
        </div>
    );
}

export default FortuneMain;
