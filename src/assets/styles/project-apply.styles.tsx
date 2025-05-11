import styled from "styled-components";

export const Container = styled.div`
  max-width: 600px;
  margin: 100px auto 40px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #f9fafb;
`;

export const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 12px;
`;

export const Description = styled.p`
  font-size: 15px;
  color: #374151;
  margin-bottom: 20px;
  line-height: 1.5;
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 12px;
  font-size: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  resize: none;
  margin-bottom: 24px;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

export const SubmitButton = styled.button`
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background-color: #1e40af;
  }
`;

export const CancelButton = styled.button`
  background-color: transparent;
  border: 1px solid #94a3b8;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: auto;

  &:hover {
    background-color: #f1f5f9;
  }
`;