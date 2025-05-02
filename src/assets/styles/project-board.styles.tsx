import styled from "styled-components";
import { Link } from "react-router-dom";

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
  margin: 120px auto 40px;   // 공지사항과 동일하게 여백 설정
  padding: 0 20px;
`;

export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 10px;
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
  grid-template-columns: 60px 2.5fr 0.9fr 0.9fr 0.7fr 1fr 0.5fr; 
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
  grid-template-columns: 60px 2.5fr 0.9fr 0.9fr 0.7fr 1fr 0.5fr; 
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

// ✅ 여기를 Link로 수정!
export const ProjectTitle = styled(Link)`
  color: #00256c;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;

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