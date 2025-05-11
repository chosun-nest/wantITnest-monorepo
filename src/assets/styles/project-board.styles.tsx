import styled from "styled-components";

export const Container = styled.div`
  padding-top: 140px;
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
`;

export const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const FilterList = styled.div`
  display: flex;
  gap: 1rem;
`;

interface FilterItemProps {
  $selected: boolean;
}

export const FilterItem = styled.span<FilterItemProps>`
  cursor: pointer;
  font-size: 0.9rem;
  font-family: 'Spoqa Han Sans', sans-serif;
  font-weight: ${({ $selected }) => ($selected ? 'bold' : 'normal')};
  text-decoration: ${({ $selected }) => ($selected ? 'underline' : 'none')};
  color: ${({ $selected }) => ($selected ? '#1f2937' : '#9ca3af')};

  &:hover {
    color: ${({ $selected }) => ($selected ? '#1f2937' : '#374151')};
    text-decoration: underline;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1rem 0;
`;

export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: auto;
`;

export const SubText = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
`;

export const SearchInput = styled.input`
  width: 320px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  margin-right: 0.5rem;
`;

export const FilterButton = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background-color: #e5e7eb;
  }
`;

export const SelectedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const Tag = styled.span`
  background-color: #f3f4f6;
  color: #1f2937;
  padding: 4px 8px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-weight: 500;
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Card = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  cursor: pointer;
  position: relative;
`;

export const StatusBadge = styled.div<{ status: string }>`
  background-color: ${({ status }) =>
    status === "모집중" ? "#dbeafe" : "#fef3c7"};
  color: ${({ status }) =>
    status === "모집중" ? "#1e3a8a" : "#92400e"};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
`;

export const ProjectTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const ProjectPreview = styled.p`
  font-size: 14px;
  color: #555;
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const ProjectMetaLeft = styled.div`
  font-size: 12px;
  color: #888;
`;

export const ProjectMetaRight = styled.div`
  font-size: 12px;
  color: #888;
  text-align: right;
`;

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const Pagination = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  & > button {
    padding: 0.5rem 0.75rem;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
    &.active {
      background-color: #1d4ed8;
      color: white;
      font-weight: bold;
    }
  }
`;