import styled from "styled-components";

export const GridContainer = styled.div<{ $isMobile: boolean }>`
  display: grid;
  gap: 10px;
  margin-top: 80px; /* Layout과 겹치지 않도록 여백 추가 */
  width: 100%;
  max-width: 600px; /* 최대 너비 제한 */
  margin-left: auto;
  margin-right: auto;

  /* 데스크탑 모드 (2x2 그리드) */
  ${({ $isMobile }) =>
    !$isMobile &&
    `
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  `}

  /* 모바일 모드 (세로 정렬) */
  ${({ $isMobile }) =>
    $isMobile &&
    `
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  `}
`;

export const GridItem = styled.div`
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #002f6c;
  aspect-ratio: 1 / 1; /* 1:1 비율 유지 */
  width: 100%; /* 부모 요소에 따라 크기 자동 조정 */
`;

/* 각 아이템 색상 */
export const Item1 = styled(GridItem)`
  background-color: #ff6b6b;
`;

export const Item2 = styled(GridItem)`
  background-color: #6bc5a4;
`;

export const Item3 = styled(GridItem)`
  background-color: #f7c653;
`;

export const Item4 = styled(GridItem)`
  background-color: #4a90e2;
`;
