import styled from "styled-components";

export const NavbarContainer = styled.nav`
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 1.5rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
`;

export const NavbarContent = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  font-size: 1.2rem;
  font-weight: bold;
  color: #002f6c;
  gap: 0.5rem;

  img {
    height: 30px;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  gap: 1.5rem;
  color: black;
  svg {
    height: 24px;
    width: 24px;
  }
`;

export const NavItem = styled.a`
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  transition: color 0.2s;

  &:hover {
    color: #002f6c;
  }
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const SearchIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #333;

  &:hover {
    color: #002f6c;
  }
`;

export const LoginButton = styled.button`
  background: white;
  border: 1px solid #002f6c;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #002f6c;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #002f6c;
    color: white;
  }
`;

export const SignUpButton = styled(LoginButton)`
  background: #002f6c;
  color: white;
  border: none;

  &:hover {
    background: #001b40;
  }
`;
