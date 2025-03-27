import * as S from "../assets/styles/login.styles";
import useResponsive from "../hooks/responsive";

export default function Login() {
  const isMobile = useResponsive(); // 가로/세로 상태 감지
  return (
    <S.Container>
      {/* 로고 위치를 동적으로 조절 */}
      <S.Header $isMobile={isMobile}>
        <S.LogoText>WantIT-Nest</S.LogoText>
      </S.Header>
      {/*로그인 박스*/}
      <S.LoginBox>
        {/* 이메일 및 비밀번호 입력 */}
        <S.InputTitle>아이디</S.InputTitle>
        <S.Input type="id" placeholder="아이디" />
        <S.InputTitle>비밀번호</S.InputTitle>
        <S.Input type="password" placeholder="비밀번호" />

        <S.LoginButton>로그인</S.LoginButton>
        <S.FindContainer>
          <S.AccountLink to="/find-id">
            <S.FindButton>아이디 찾기</S.FindButton>
          </S.AccountLink>
          <S.AccountLink to="/find-password">
            <S.FindButton>비밀번호 찾기</S.FindButton>
          </S.AccountLink>
        </S.FindContainer>
        <S.AccountLink to="/signin">
          <S.SigninButton>회원 가입하기</S.SigninButton>
        </S.AccountLink>
      </S.LoginBox>
    </S.Container>
  );
}
