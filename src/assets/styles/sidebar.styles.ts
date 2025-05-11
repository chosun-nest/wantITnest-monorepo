import { Link } from "react-router-dom";
import styled from "styled-components";

export const SidebarContainer = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9998;
`;

export const SidebarWrapper = styled.div<{ $visible: boolean }>`
  width: 500px;
  height: 100%;
  background: #ffffff;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  transform: ${({ $visible }) =>
    $visible ? "translateX(0%)" : "translateX(100%)"};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
`;

export const UpperBar = styled.div`
  height: 120px;
  background-color: #002f6c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.2rem;
  color: white;
  border-bottom: 1px solid #eaeaea;
`;

export const LoginBox = styled.div`
  display: flex;
  color: white;
  flex-direction: row;
  background-color: #002f6c;
  align-items: center;
  justify-content: center;
  height: 50px;
`;
export const LoginLink = styled(Link)`
  display: inline-block;
  border: 1px solid #002f6c;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
`;

export const Title = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
`;

export const CloseButton = styled.button`
  font-size: 1.8rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
`;

export const MenuList = styled.div`
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.8rem 0;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #002f6c;
    font-weight: 600;
    transform: translateX(4px);
    transition: all 0.2s ease;
  }
`;
