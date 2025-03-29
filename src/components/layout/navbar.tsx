import * as S from "../../assets/styles/navbar.styles";

export default function Navbar() {
  return (
    <S.NavbarContainer>
      <S.NavbarContent>
        {/* 네비게이션 메뉴 */}
        <S.NavMenu>
          <svg
            data-Slot="icon"
            fill="none"
            strokeWidth={1.5}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </S.NavMenu>

        {/* 로고 */}
        <S.Logo to="/">
          <img src="assets/images/logo.png" />
          CSU-NEST
        </S.Logo>

        {/* 우측 아이콘 및 버튼 */}
        <S.NavRight>
          <S.SearchIcon></S.SearchIcon>
          <S.LoginLink to="/login">Login</S.LoginLink>
          <S.SignUpLink to="/signin">Sign In</S.SignUpLink>
        </S.NavRight>
      </S.NavbarContent>
      <S.WebBar>
        {" "}
        <S.NavbarLink to="/">
          <S.WebBarItem>Nest-FE 소개</S.WebBarItem>
        </S.NavbarLink>
        <S.NavbarLink to="/notice-board">
          <S.WebBarItem>학사공지</S.WebBarItem>
        </S.NavbarLink>
        <S.NavbarLink to="/projects">
          <S.WebBarItem>프로젝트 모집</S.WebBarItem>
        </S.NavbarLink>
        <S.NavbarLink to="/interests-board">
          <S.WebBarItem>관심분야 정보</S.WebBarItem>
        </S.NavbarLink>
        <S.NavbarLink to="/chat">
          <S.WebBarItem>채팅방</S.WebBarItem>
        </S.NavbarLink>
        <S.NavbarLink to="/events">
          <S.WebBarItem>행사</S.WebBarItem>
        </S.NavbarLink>
      </S.WebBar>
    </S.NavbarContainer>
  );
}
