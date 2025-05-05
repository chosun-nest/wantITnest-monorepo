import styled from "styled-components";

// 전체 컨테이너
export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

// 제목
export const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #1b3c74;
  text-align: center;
  margin-top: 120px;
  margin-bottom: 8px;
`;

// 작성자 정보
export const SubInfo = styled.p`
  font-size: 14px;
  color: #555;
  text-align: center;
  margin-bottom: 16px;
`;

// 내용 박스
export const ContentCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  margin-bottom: 24px;
`;

// 뒤로가기 버튼
export const BackButton = styled.button`
  background-color: #1b3c74;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #16325c;
  }
`;