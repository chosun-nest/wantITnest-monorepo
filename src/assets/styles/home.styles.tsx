import styled from "styled-components";

export const GridContainer = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr); /* 3열 */
  grid-template-rows: repeat(2, auto); /* 2행 */
  margin-top: 80px;
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

export const GridItem = styled.div<{ row: string; col: string; span?: string }>`
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #002f6c;
  aspect-ratio: 1 / 1; /* 기본 1:1 비율 */

  /* grid 위치 */
  grid-row: ${({ row }) => row};
  grid-column: ${({ col }) => col} / span ${({ span }) => span || "1"};
`;
