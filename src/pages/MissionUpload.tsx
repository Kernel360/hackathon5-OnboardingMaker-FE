import React, { useState } from "react";
import styled from "styled-components";
import { API_BASE_URL } from "../config/ApiUrl";
import { useNavigate } from "react-router-dom";

const MissionUpload: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [teams, setTeams] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 폼 제출 처리
    const now = new Date();

    const pad = (n: number) => n.toString().padStart(2, "0");

    const formatDate = (d: Date) => {
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const createdAt = formatDate(new Date());
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(23, 59, 59);
    const formattedDeadline = formatDate(deadlineDate);

    const payload = {
      totalGroups: teams,
      createdAt,
      deadline: formattedDeadline,
      title,
      description,
    };

    console.log(JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`/missionWrite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("미션 생성 실패");

      const result = await response.json();
      alert("미션이 성공적으로 생성되었습니다!");
      setTitle("");
      setDescription("");
      setDeadline("");
      setTeams(1);
      navigate(`/missions/${result.missionId}/teams`);
    } catch (error) {
      console.error("에러 발생:", error);
      alert("미션 생성 중 문제가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Title>온보딩 미션 생성</Title>
      <Form onSubmit={handleSubmit}>
        <FormField>
          <Label>온보딩 제목</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="미션 제목을 입력하세요"
            required
          />
        </FormField>

        <FormField>
          <Label>설명</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="미션에 대한 설명을 입력하세요"
            required
          />
        </FormField>

        <FormField>
          <Label>마감 기한</Label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </FormField>

        <FormField>
          <Label>팀 수</Label>
          <Select
            value={teams}
            onChange={(e) => setTeams(Number(e.target.value))}
          >
            {Array.from({ length: 13 }, (_, i) => i + 1).map((teamCount) => (
              <option key={teamCount} value={teamCount}>
                {teamCount} 팀
              </option>
            ))}
          </Select>
        </FormField>

        <Button type="submit">미션 생성</Button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 자식 요소가 상단에 배치되도록 설정 */
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #4f46e5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.5rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  &:focus {
    border-color: #2563eb;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  resize: vertical;
  min-height: 120px;
  &:focus {
    border-color: #2563eb;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  &:focus {
    border-color: #2563eb;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4338ca;
  }
`;

export default MissionUpload;
