import * as S from "../assets/styles/login.styles";
import useResponsive from "../hooks/responsive";

export default function SignIn() {
  const isMobile = useResponsive(); // 가로/세로 상태 감지
  return (
    <S.Container>
      {/* 로고 위치를 동적으로 조절 */}
      <S.Header $isMobile={isMobile}>
        <S.LogoText>CHOSUN-NEST</S.LogoText>
      </S.Header>
      <S.LoginBox>
        <S.Title>Welcome to CSU-NEST</S.Title>
        <S.SubText>
          이미 계정이 있나요?{" "}
          <S.AccountLink to="/login">로그인 하기</S.AccountLink>
        </S.SubText>

        <S.Divider>or Sign in with email:</S.Divider>

        {/* 이메일 및 비밀번호 입력 */}
        <S.Input type="name" placeholder="Name" />
        <S.Input type="email" placeholder="Email" />
        <S.Input type="password" placeholder="Password" />
        <S.AccountLink to="/create-profile">
          <S.LoginButton>Sign in</S.LoginButton>
        </S.AccountLink>
      </S.LoginBox>
    </S.Container>
  );
}
