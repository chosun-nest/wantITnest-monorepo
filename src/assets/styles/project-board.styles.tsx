import styled from "styled-components";
import { Link } from "react-router-dom";

// 검색창
export const SearchInput = styled.input`
  margin-top: 10px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  margin-left: auto;
`;

// 전체 감싸는 컨테이너
export const Container = styled.div`
  max-width: 1000px;
  margin: 120px auto 40px;
  padding: 0 20px;
`;

// 제목 섹션
export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1rem;
`;

// 페이지 제목
export const PageTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #00256c;
`;

// 서브 텍스트
export const SubText = styled.p`
  font-size: 0.9rem;
  color: #333;
`;

// 상단 헤더 (제목 / 작성일 / 참여인원)
export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 6fr 1.6fr 1.6fr;
  padding: 12px 20px;
  background-color: #f2f4f6;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.95rem;
  color: #00256c;

  div:nth-child(1) {
    text-align: left;
  }
  div:nth-child(2),
  div:nth-child(3) {
    text-align: center;
  }
`;

// 프로젝트 카드 한 줄 (3열)
export const ProjectRow = styled.div`
  display: grid;
  grid-template-columns: 6fr 1.6fr 1.6fr;  // 적당히 줄여서 간격 조절
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }
`;

// 제목 + 뱃지를 감싸는 div
export const TitleWithBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;

  span {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

// 제목
export const ProjectTitle = styled.span`
  color: #00256c;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// 작성자 + 조회수
export const ProjectMeta = styled.div`
  font-size: 14px;
  color: #777;
  margin-top: 6px;
`;

// 상태 뱃지
export const StatusBadge = styled.div<{ status: string }>`
  display: inline-block;
  white-space: nowrap;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background-color: ${({ status }) =>
    status === "모집중" ? "#2E77D0" : "#9E9E9E"};
  flex-shrink: 0;
`;

// 페이지네이션
export const Pagination = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 30px;
  justify-content: center;

  button {
    padding: 6px 10px;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #f2f2f2;
    }
  }

  .active {
    background-color: #00256c;
    color: white;
    font-weight: bold;
  }
`;

// 글쓰기 버튼
export const WriteButton = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 16px;
  background-color: #00256c;
  color: white;
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;

  &:hover {
    background-color: #001a4d;
  }
`;