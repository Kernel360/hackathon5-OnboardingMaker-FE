import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface OnboardingMission {
  id: number;
  title: string;
  description: string;
  status: "완료" | "진행 중" | "미시작";
  deadline: string;
  missionId: number;
}

const Main: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [missions, setMissions] = useState<OnboardingMission[]>([]);

  // 관리자 모드 토글 함수
  const toggleAdminMode = () => {
    setIsAdmin((prev) => !prev);
  };

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch("/api/mission/list", {
          credentials: "include",
        });
        const data = await response.json();

        const missionsWithIdAndStatus = data.map(
          (mission: { deadline: string | number | Date }, index: number) => {
            const today = new Date();
            const deadline = new Date(mission.deadline);

            let status = "미시작";

            const formattedDeadlineStr = deadline.toISOString().split("T")[0];

            const formattedDeadline = new Date(formattedDeadlineStr);

            if (formattedDeadline < today) {
              status = "완료";
            } else if (deadline.toDateString() === today.toDateString()) {
              status = "진행 중";
            }

            return {
              ...mission,
              id: index + 1,
              deadline: formattedDeadlineStr,
              status,
            };
          },
        );

        setMissions(missionsWithIdAndStatus);
      } catch (error) {
        console.error("Failed to fetch missions:", error);
      }
    };

    fetchMissions();
  }, []);

  return (
    <MainContainer isAdmin={isAdmin}>
      <div>
        <TitleSection>
          <Title>온보딩 미션</Title>
          <Subtitle>새로운 팀원과 함께 온보딩 미션을 완료하세요</Subtitle>

          {/* 관리자 모드 전환 토글 */}
          <ToggleButton onClick={toggleAdminMode}>
            {isAdmin ? "관리자 모드 해제" : "관리자 모드 활성화"}
          </ToggleButton>
        </TitleSection>

        <MissionGrid isAdmin={isAdmin}>
          {missions.map((mission) => (
            <Card key={mission.id}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <CardTitle>{mission.title}</CardTitle>
                  <Badge status={mission.status}>{mission.status}</Badge>
                </div>
                <Description>{mission.description}</Description>
                <DueDate>
                  <CalendarDays size={16} />
                  {mission.deadline}
                </DueDate>
                <div style={{ flexGrow: 1 }} />
                <Link to={`/missions/${mission.missionId}/teams`}>
                  {" "}
                  <StartButton
                    disabled={
                      mission.status !== "진행 중" &&
                      mission.status !== "미시작"
                    }
                  >
                    미션 시작
                  </StartButton>
                </Link>
              </CardContent>
            </Card>
          ))}
        </MissionGrid>
      </div>

      {isAdmin && (
        <AdminWrapper>
          <Link to="/missionupload">
            {" "}
            <AdminCard>
              <h3 style={{ fontWeight: 600 }}>관리자 기능</h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                온보딩 미션을 생성하고 관리할 수 있습니다.
              </p>
              <AdminButton>+ 온보딩 미션 생성</AdminButton>
            </AdminCard>
          </Link>
        </AdminWrapper>
      )}
    </MainContainer>
  );
};

export default Main;

const MainContainer = styled.div<{ isAdmin: boolean }>`
  display: grid;
  grid-template-columns: ${({ isAdmin }) => (isAdmin ? "3fr 1fr" : "1fr")};
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
    isAdmin ? "repeat(3, 1fr)" : "repeat(auto-fill, minmax(250px, 1fr))"};
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

const Badge = styled.span<{ status: OnboardingMission["status"] }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  margin-left: auto;
  background-color: ${({ status }) =>
    status === "완료"
      ? "#dcfce7"
      : status === "진행 중"
        ? "#dbeafe"
        : "#f3f4f6"};
  color: ${({ status }) =>
    status === "완료"
      ? "#15803d"
      : status === "진행 중"
        ? "#1d4ed8"
        : "#4b5563"};
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

  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
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
