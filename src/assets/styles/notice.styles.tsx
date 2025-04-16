// src/assets/styles/notice.styles.tsx
import styled from "styled-components";

export const SearchInput = styled.input`
  margin-top: 10px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  margin-left: auto;
`;

export const Container = styled.div`
  max-width: 1000px;
  margin: 120px auto 40px;
  padding: 0 20px;
`;

export const TitleSection = styled.div`
  margin-bottom: 1rem;
`;

export const PageTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #00256c;
`;

export const SubText = styled.p`
  font-size: 0.9rem;
  color: #333;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 1.8fr 1fr 1fr 0.7fr 0.5fr;
  padding: 12px 20px;
  background-color: #f2f4f6;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.95rem;
  color: #00256c;
`;

export const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1.8fr 1fr 1fr 0.7fr 0.5fr;
  padding: 14px 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
  font-size: 0.9rem;

  &:hover {
    background-color: #f8f9fa;
  }

  svg {
    font-size: 0.85rem;
    color: #666;
  }
`;

export const NoticeTitle = styled.span`
  color: #00256c;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

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
  }

  .active {
    background-color: #00256c;
    color: white;
    font-weight: bold;
  }
`;
