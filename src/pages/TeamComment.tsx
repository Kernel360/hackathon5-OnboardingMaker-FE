import React from 'react';
import { useParams } from 'react-router-dom';

const TeamComment: React.FC = () => {
  const { missionId, teamId } = useParams();

  return (
    <div>
      <h1>미션 ID: {missionId}</h1>
      <h2>팀 ID: {teamId}</h2>
    </div>
  );
};

export default TeamComment;