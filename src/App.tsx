// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
import MissionUpload from './pages/MissionUpload';
import TeamList from './pages/TeamList';
import TeamComment from './pages/TeamComment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/missionupload" element={<MissionUpload />} /> 
        <Route path="/missions/:missionId/teams" element={<TeamList />} />
        <Route path="/missions/:missionId/teams/:teamId" element={<TeamComment />} />
      </Routes>
    </Router>
  );
}
//TeamList: 1번 미션의 팀 리스트 조회
//TeamComment: 1번 미션 안의 5번 팀 댓글 페이지

export default App;

