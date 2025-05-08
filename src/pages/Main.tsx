import React, { useState } from 'react';
import styled from 'styled-components';
import { CalendarDays } from 'lucide-react';

interface OnboardingMission {
  id: number;
  title: string;
  description: string;
  status: '완료' | '진행 중' | '미시작';
  dueDate: string;
}

const missions: OnboardingMission[] = [
  {
    id: 1,
    title: '기존 기수의 git repo 분석',
    description: '기존 기수의 git repo 중 하나 선택하여 분석하고 공유하기 ',
    status: '완료',
    dueDate: '2025-05-05',
  },
  {
    id: 2,
    title: 'jwt, spring security',
    description: 'jwt, spring security등 인증에 대해 분석하고 공유하기',
    status: '완료',
    dueDate: '2025-05-06',
  },
  {
    id: 3,
    title: 'ORM과 JPA',
    description: 'ORM과 JPA에 대해 분석하고 공유하기',
    status: '완료',
    dueDate: '2025-05-07',
  },
  {
    id: 4,
    title: 'TDD와 테스트 코드',
    description: 'TDD와 테스트 코드에 대해 분석하고 공유하기',
    status: '완료',
    dueDate: '2025-05-08',
  },
  {
    id: 5,
    title: '첫 프로젝트 참여하기',
    description: '첫 번째 프로젝트에 참여하여 실무 경험을 쌓으세요.',
    status: '진행 중',
    dueDate: '2025-05-09',
  },
];

const Main: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // 관리자 모드 토글 함수
    const toggleAdminMode = () => {
      setIsAdmin((prev) => !prev);
    };

  return (
    <MainContainer isAdmin={isAdmin}>
      <div>
        <TitleSection>
          <Title>온보딩 미션</Title>
          <Subtitle>새로운 팀원과 함께 온보딩 미션을 완료하세요</Subtitle>

          {/* 관리자 모드 전환 토글 */}
          <ToggleButton onClick={toggleAdminMode}>
            {isAdmin ? '관리자 모드 해제' : '관리자 모드 활성화'}
          </ToggleButton>
        </TitleSection>
      

        <MissionGrid isAdmin={isAdmin}>
          {missions.map((mission) => (
            <Card key={mission.id}>
              <CardContent>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <CardTitle>{mission.title}</CardTitle>
                  <Badge status={mission.status}>{mission.status}</Badge>
                </div>
                <Description>{mission.description}</Description>
                <DueDate>
                  <CalendarDays size={16} />
                  {mission.dueDate}
                </DueDate>
                <div style={{ flexGrow: 1 }} />
                <StartButton>미션 시작</StartButton>
              </CardContent>
            </Card>
          ))}
        </MissionGrid>
      </div>

      {isAdmin && (
        <AdminWrapper>
          <AdminCard>
            <h3 style={{ fontWeight: 600 }}>관리자 기능</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              온보딩 미션을 생성하고 관리할 수 있습니다.
            </p>
            <AdminButton>+ 온보딩 미션 생성</AdminButton>
          </AdminCard>
        </AdminWrapper>
      )}
    </MainContainer>
  );
};

export default Main;

const MainContainer = styled.div<{ isAdmin: boolean }>`
  display: grid;
  grid-template-columns: ${({ isAdmin }) => (isAdmin ? '3fr 1fr' : '1fr')};
  gap: 2rem;
  padding: 2rem;
  align-items: flex-start;
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  color: #6b7280;
`;

const MissionGrid = styled.div<{ isAdmin?: boolean }>`
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: ${({ isAdmin }) =>
    isAdmin ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))'};
  gap: 1.5rem;
`;

const Card = styled.div`
  min-width: 280px;
  max-width: 320px;
  flex-shrink: 0;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  flex: 1;
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Badge = styled.span<{ status: OnboardingMission['status'] }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  margin-left: auto;
  background-color: ${({ status }) =>
    status === '완료' ? '#dcfce7' : status === '진행 중' ? '#dbeafe' : '#f3f4f6'};
  color: ${({ status }) =>
    status === '완료' ? '#15803d' : status === '진행 중' ? '#1d4ed8' : '#4b5563'};
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const DueDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StartButton = styled.button`
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const AdminWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const AdminCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding-left: 2rem;
  padding-right: 2rem;
`;

const AdminButton = styled(StartButton)`
  background-color: #4f46e5;

  &:hover {
    background-color: #4338ca;
  }
`;

const ToggleButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;

  &:hover {
    background-color: #1d4ed8;
  }
`;