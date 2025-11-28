import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 페이지들 불러오기
import Login from "./pages/Login";
import FortuneMain from "./pages/FortuneMain";
import Result from "./pages/Result";

function App() {
  return (
    <Router>
      <Routes>
        {/* 주소창에 아무것도 없으면(기본) 로그인 페이지 보여주기 */}
        <Route path="/" element={<Login />} />
        
        {/* /main 으로 가면 메인 페이지 */}
        <Route path="/main" element={<FortuneMain />} />
        
        {/* /result 로 가면 결과 페이지 */}
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;