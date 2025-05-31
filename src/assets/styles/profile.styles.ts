// 프로필 페이지 ts
import styled from "styled-components";

interface GridContainerProps {
  $isMobile: boolean;
  $navbarHeight: number;
}
interface GridItemProps {
  $isMobile: boolean;
  $row: string;
  $col: string;
  $rowSpan?: string;
  $colSpan?: string;
  $noMinHeight?: boolean;
}
interface HistoryContentProps {
  $open: boolean;
}

export const GridContainer = styled.div<GridContainerProps>`
  display: grid;
  gap: 20px;
  padding: ${({ $navbarHeight }) => `${$navbarHeight + 20}px 20px 40px`};
  margin: 0 auto;
  max-width: 1200px;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "1fr" : "repeat(3, 1fr)"};
  grid-auto-rows: auto;
`;

export const GridItem = styled.div<GridItemProps>`
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;

  ${({ $noMinHeight }) =>
    $noMinHeight ? `min-height: auto;` : `min-height: 160px;`}

  grid-row: ${({ $isMobile, $row, $rowSpan }) =>
    $isMobile ? "auto" : `${$row} / span ${$rowSpan || 1}`};
  grid-column: ${({ $isMobile, $col, $colSpan }) =>
    $isMobile ? "auto" : `${$col} / span ${$colSpan || 1}`};
`;

export const ItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: #00256c;
  border-bottom: 1px solid #00256c;
  padding-bottom: 8px;
  cursor: pointer;
`;

export const HistoryContent = styled.div<HistoryContentProps>`
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  max-height: ${({ $open }) => ($open ? "500px" : "0px")};
  padding: ${({ $open }) => ($open ? "16px" : "0 16px")};
  margin-top: ${({ $open }) => ($open ? "8px" : "0")};
`;
