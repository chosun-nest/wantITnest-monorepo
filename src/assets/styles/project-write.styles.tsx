import styled from "styled-components";

export const Container = styled.div`
  padding: 120px 20px 20px 20px;
  text-align: center;
`;

// 하늘색 배너
export const InfoBanner = styled.div`
  background-color: #e6f0ff;
  color: #00256c;
  font-size: 15px;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 8px;
  text-align: left;
`;

// 제목
export const TitleInput = styled.input`
  width: 100%;
  padding: 16px;
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 20px;
`;

export const ParticipantsInput = styled.input`
  width: 35%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;
`;

export const ContentTextArea = styled.textarea`
  width: 100%;
  height: 240px;
  padding: 14px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  margin-bottom: 15px;
`;

// 버튼 박스
export const ButtonGroup = styled.div`
  margin-top: 20px;
`;

export const CancelButton = styled.button`
  padding: 8px 20px;
  font-size: 15px;
  background-color: #eee;
  color: black;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  padding: 8px 20px;
  font-size: 15px;
  background-color: #0057ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;