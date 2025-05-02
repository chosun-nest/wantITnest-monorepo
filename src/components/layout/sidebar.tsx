// src/components/sidebar/Sidebar.tsx
import { useEffect, useState } from "react";
import * as S from "../../assets/styles/sidebar.styles";

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <S.SidebarContainer onClick={handleClose}>
      <S.SidebarWrapper $visible={visible} onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={handleClose}>×</S.CloseButton>
        <S.MenuItem>홈</S.MenuItem>
        <S.MenuItem>공지사항</S.MenuItem>
        <S.MenuItem>프로젝트</S.MenuItem>
        <S.MenuItem>채팅</S.MenuItem>
      </S.SidebarWrapper>
    </S.SidebarContainer>
  );
}
