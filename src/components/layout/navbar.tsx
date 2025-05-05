import { forwardRef, useEffect, useRef, useState, ForwardedRef } from "react";
import { useBackdrop } from "../../context/Backdropcontext";
import * as S from "../../assets/styles/navbar.styles";
import useResponsive from "../../hooks/responsive";
import { useNavigate } from "react-router-dom";
import { useNavbarHeight } from "../../context/NavbarHeightContext";
import { getMemberProfile, MemberProfile } from "../../api/profile/api";
import Sidebar from "./sidebar";
import { useDispatch } from "react-redux";
import { clearTokens } from "../../store/slices/authSlice";

function Navbar(_: unknown, ref: ForwardedRef<HTMLDivElement>) {
  const isMobile = useResponsive();
  const { setShowBackdrop } = useBackdrop();
  const { setNavbarHeight } = useNavbarHeight();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(
    null
  );

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearTokens());
    setIsMenuOpen(false);
    navigate("/login");
  };

  // api/profile/api의 API 호출
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMemberProfile();
        setMemberProfile(profile);
      } catch (error) {
        console.error("프로필 불러오기 실패:", error);
      }
    };

    fetchProfile();
  }, []);

  // ResizeObserver로 Navbar 높이 자동 감지
  useEffect(() => {
    if (!ref || !("current" in ref) || !ref.current) return;

    const observer = new ResizeObserver(() => {
      if (ref.current) {
        setNavbarHeight(ref.current.offsetHeight);
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, setNavbarHeight]);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      {" "}
      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
      <S.NavbarContainer ref={ref}>
        <S.NavbarContent>
          {/* 메뉴 토글 버튼 */}
          <S.NavMenu>
            {!isMobile ? (
              <div
                onClick={() => setShowBackdrop((prev) => !prev)}
                style={{ cursor: "pointer" }}
              >
                ....
              </div>
            ) : (
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                onClick={() => setIsSidebarOpen(true)} // 사이드바 열기
                style={{ cursor: "pointer" }} // 클릭 가능해 보이게 커서 추가
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </S.NavMenu>

          {/* 로고 */}
          <S.Logo to="/">
            <img src="assets/images/logo.png" />
            WantIT-NEST
          </S.Logo>

          {/* 우측 버튼 */}
          <S.NavRight>
            <S.SearchIcon />

            {localStorage.getItem("accesstoken") ? (
              <S.ProfileWrapper ref={menuRef}>
                <S.ProfileIcon
                  src={
                    memberProfile?.memberImageUrl || "/assets/images/user.png"
                  }
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                />{" "}
                {memberProfile != null ? (
                  <div className="text-[12px]">
                    {memberProfile.memberName} 님 <br />
                    환영합니다!
                  </div>
                ) : null}
                <S.ProfileMenu $visible={isMenuOpen}>
                  <S.ProfileMenuItem onClick={() => navigate("/profile")}>
                    내 프로필
                  </S.ProfileMenuItem>
                  <S.ProfileMenuItem onClick={handleLogout}>
                    로그아웃
                  </S.ProfileMenuItem>
                </S.ProfileMenu>
              </S.ProfileWrapper>
            ) : (
              <>
                <S.LoginLink to="/login">Login</S.LoginLink>
                <S.SignUpLink to="/signup">Sign Up</S.SignUpLink>
              </>
            )}
          </S.NavRight>
        </S.NavbarContent>

        {/* 데스크탑용 하단바 */}
        {!isMobile && (
          <S.WebBar>
            <S.NavbarLink to="/notice-board">
              <S.WebBarItem>학사공지</S.WebBarItem>
            </S.NavbarLink>
            <S.NavbarLink to="/project-board">
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
        )}
      </S.NavbarContainer>
    </>
  );
}

export default forwardRef<HTMLDivElement, unknown>(Navbar);
