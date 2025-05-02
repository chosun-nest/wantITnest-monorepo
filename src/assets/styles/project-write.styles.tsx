import styled from "styled-components";

export const Container = styled.div`
  padding: 120px 20px 20px 20px;
  text-align: center;
`;

export const TitleInput = styled.input`
  width: 50%;
  padding: 10px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;
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
  width: 50%;
  height: 200px;
  padding: 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 15px;
`;

// 버튼 박스 (가운데 정렬)
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