import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const TeamList: React.FC = () => {
  const { missionId } = useParams();
  const [title, setTitle] = useState('');
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    const fetchMissionInfo = async () => {
      try {
        const response = await fetch(`/api/mission/${missionId}/teams`);
        if (!response.ok) throw new Error('데이터 불러오기 실패');
        const data = await response.json();
        setTitle(data.title);
        setTeamCount(data.totalGroups);
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    fetchMissionInfo();
  }, [missionId]);

  const teams = Array.from({ length: teamCount }, (_, index) => index + 1);

  const handleTeamClick = (team: number) => {
    alert(`팀 ${team} 페이지로 이동`);
    // 예: navigate(`/missions/${missionId}/teams/${team}`);
  };

  return (
    <MainContainer>
      <Title>{title}</Title>
      <Subtitle>새로운 팀원과 함께 온보딩 미션을 완료하세요</Subtitle>

      <TeamGrid>
        {teams.map((team) => (
          <TeamCard key={team} onClick={() => handleTeamClick(team)}>
            <TeamNumber>{team}팀</TeamNumber>
          </TeamCard>
        ))}
      </TeamGrid>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: grid;
  padding: 2rem;
  align-items: flex-start;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  text-align: center;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

const TeamCard = styled.div`
  background: #2563eb;
  color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const TeamNumber = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
`;

export default TeamList;