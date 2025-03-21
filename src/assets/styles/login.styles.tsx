import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: WHITE;
`;

export const Header = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;

  /* 반응형: 화면이 세로가 가로보다 크거나 같다면 가운데 정렬 */
  justify-content: ${(props) => (props.$isMobile ? "center" : "flex-start")};
`;

export const LogoText = styled.h1`
  font-size: 50px;
  font-weight: 400;
  font-family: "Monomaniac One", sans-serif;
  color: #002f6c; /* 네이비 색상 */
`;

export const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
  background: #f6f7ff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 1rem; /* 로고와 간격 */
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

export const SubText = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1.5rem;

  a {
    color: #00256c;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const OAuthButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 0.875rem;
  font-weight: bold;
  color: #444;
  cursor: pointer;
  margin-bottom: 0.75rem;
  transition: background 0.2s;

  svg {
    width: 18px;
    height: 18px;
  }

  img {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: #f8f9fa;
  }
`;

export const Divider = styled.div`
  font-size: 0.875rem;
  color: #999;
  margin: 1rem 0;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  background: #00256c;
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: background 0.2s;

  &:hover {
    background: #0046c9;
  }
`;

export const AccountLink = styled(Link)`
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;
  text-decoration: none;
  text-decoration-line: none;
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

export const NoAccount = styled.a`
  color: #00256c;
  text-decoration: none;
  font-weight: 200;
`;

export const ProfileImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
`;

// 파일 입력은 화면에서 숨김
export const FileInput = styled.input`
  display: none;
`;

export const ProfilePlaceholder = styled.div`
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #999;
  text-align: center;
  cursor: pointer;
`;

export const ProfileImage = styled.img`
  width: 108px;
  height: 108px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
  cursor: pointer;
`;

/* ✅ 보유 기술 입력란 스타일 */
export const SkillContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const SkillRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem; /* 버튼과 입력 칸 간격 조정 */
  margin-bottom: 0.5rem;
`;

/* ✅ 버튼 크기 조정 */
export const AddButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #218838;
  }
`;

export const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background: #c82333;
  }
`;
