// src/components/sidebar/Sidebar.styles.ts
import styled from "styled-components";

export const SidebarContainer = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
`;

export const SidebarWrapper = styled.div<{ $visible: boolean }>`
  width: 240px;
  height: 100%;
  background: white;
  padding: 1rem;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;

  transform: ${({ $visible }) =>
    $visible ? "translateX(0%)" : "translateX(-100%)"};
  transition: transform 0.3s ease; /* 애니메이션 자연스럽게 */
`;

export const CloseButton = styled.button`
  align-self: flex-end;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
`;

export const MenuItem = styled.div`
  margin-top: 1.5rem;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    font-weight: bold;
  }
`;
