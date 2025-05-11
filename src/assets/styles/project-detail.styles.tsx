import styled from "styled-components";

// 전체 컨테이너
export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

// 제목과 뱃지 함께 배치
export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 120px;
  margin-bottom: 8px;
  width: 100%;
`;

// 제목
export const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #1b3c74;
  text-align: left;
  margin: 0;
`;

// 참여중, 참여완료 상태 배찌
export const StatusBadge = styled.div<{ status: string }>`
  background-color: ${({ status }) =>
    status === "모집중" ? "#dbeafe" : "#e5e7eb"};
  color: ${({ status }) =>
    status === "모집중" ? "#1e3a8a" : "#6b7280"};
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
`;

// 작성자 정보
export const SubInfo = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 16px;
  text-align: left;
`;

// 내용 박스
export const ContentCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  margin-bottom: 24px;
  width: 100%;
`;

// 설명
export const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-top: 10px;
  text-align: left;
`;

// 구분선
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 20px 0;
  width: 100%;
`;

// 메타 정보
export const MetaBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.95rem;
  color: #444;
`;

// 작성자 라벨
export const AuthorRow = styled.div`
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

export const Author = styled.span`
  font-weight: bold;
  color: #000000;
`;

// 지원하기 버튼
export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
`;

export const ApplyButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 10px 18px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #1e40af;
  }
`;

// 뒤로 가기 버튼
export const BackButton = styled.button`
  background-color: #1b3c74;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #16325c;
  }
`;