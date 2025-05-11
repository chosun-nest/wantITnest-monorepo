import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "../assets/styles/project-apply.styles";

interface Project {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  views: number;
  participants: string;
  status: string;
  tags: string[];
  hasAttachment: boolean;
}

export default function ProjectApply() {
  const navigate = useNavigate();
  const location = useLocation();

  // location.state 타입을 명확히 지정
  const state = location.state as { project?: Project } | null;
  const project = state?.project;

  const [reason, setReason] = useState("");

  useEffect(() => {
    // 새로고침 시 location.state가 없어지는 걸 방지하고자 알림 추가
    if (!project) {
      console.warn("❌ 지원 프로젝트 정보가 없습니다.");
    }
  }, [project]);

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("지원 동기를 입력해주세요!");
      return;
    }

    alert("✅ 지원이 완료되었습니다!");
    navigate("/project-board");
  };

  if (!project) {
    return (
      <S.Container>
        <S.Title>❌ 지원할 프로젝트를 찾을 수 없습니다.</S.Title>
        <S.BackButton onClick={() => navigate("/project-board")}>← 돌아가기</S.BackButton>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Title>{project.title}에 지원 동기 작성</S.Title>
      <S.Description>
        본인이 왜 이 프로젝트에 지원하는지 간단히 소개해주세요. <br />
        지금까지의 경험, 열정, 관심 분야 등을 자유롭게 작성해도 좋아요!
      </S.Description>

      <S.TextArea
        placeholder="예: 프론트엔드에 관심이 많고 React로 몇 개의 토이 프로젝트를 진행해봤습니다. 이번 기회를 통해 함께 성장하고 싶어요!"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <S.ButtonRow>
        <S.BackButton onClick={() => navigate(-1)}>← 뒤로 가기</S.BackButton>
        <S.SubmitButton onClick={handleSubmit}>지원하기</S.SubmitButton>
      </S.ButtonRow>
    </S.Container>
  );
}
