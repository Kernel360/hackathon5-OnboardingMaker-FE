import React from 'react';
import { useParams } from 'react-router-dom';

const TeamList: React.FC = () => {
  const { missionId, teamId } = useParams();

  return (
    <div>
      <h1>미션 ID: {missionId}</h1>
    </div>
  );
};

export default TeamList;