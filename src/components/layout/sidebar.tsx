import { useEffect, useState } from "react";
import * as S from "../../assets/styles/sidebar.styles";
import { Link } from "react-router-dom";

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
        <Link to="/" onClick={handleClose}>
          <S.MenuItem>홈</S.MenuItem>
        </Link>
        <Link to="/notice-board" onClick={handleClose}>
          <S.MenuItem>공지사항</S.MenuItem>
        </Link>
        <Link to="/project-board" onClick={handleClose}>
          <S.MenuItem>프로젝트</S.MenuItem>
        </Link>
        <Link to="/interests-board" onClick={handleClose}>
          <S.MenuItem>관심분야 게시판</S.MenuItem>
        </Link>
      </S.SidebarWrapper>
    </S.SidebarContainer>
  );
}
