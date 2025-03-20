import useResponsive from "../hooks/responsive"; // 반응형 훅 가져오기
import * as S from "../assets/styles/home.styles"; // Styled Components 스타일 가져오기

export default function Home() {
  const isMobile = useResponsive(); // 모바일 여부 감지

  return (
    <>
      <S.GridContainer $isMobile={isMobile}>
        <S.Item1>게시판</S.Item1>
        <S.Item2>관심분야</S.Item2>
        <S.Item3>공지사항</S.Item3>
        <S.Item4>프로젝트 모집</S.Item4>
      </S.GridContainer>
    </>
  );
}
