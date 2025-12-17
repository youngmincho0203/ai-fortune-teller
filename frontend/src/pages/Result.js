import React from 'react';
import './ResultModal.css';

// 모달(팝업) 컴포넌트
function Result({ isOpen, onClose, title, content }) {
    // 열려있지 않으면 아무것도 안 그림
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* 모달 내부를 클릭해도 닫히지 않게 stopPropagation 사용 */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* 우측 상단 닫기 버튼 */}
                <button className="close-btn-x" onClick={onClose}>
                    &times;
                </button>

                <h2 className="modal-title">{title}</h2>

                <div className="modal-body">
                    {content ? content : "운세 데이터를 불러오는 중입니다..."}
                </div>

                <button className="confirm-btn" onClick={onClose}>
                    확인
                </button>
            </div>
        </div>
    );
}

export default Result;
