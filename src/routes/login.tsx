import * as S from "../assets/styles/login.styles";
import useResponsive from "../hooks/responsive";

export default function Login() {
  const isMobile = useResponsive(); // 가로/세로 상태 감지
  return (
    <S.Container>
      {/* 로고 위치를 동적으로 조절 */}
      <S.Header $isMobile={isMobile}>
        <S.LogoText>CHOSUN-NEST</S.LogoText>
      </S.Header>
      <S.LoginBox>
        <S.Title>Welcome to CSU-NEST</S.Title>

        {/* 이메일 및 비밀번호 입력 */}
        <S.Input type="email" placeholder="Email" />
        <S.Input type="password" placeholder="Password" />

        <S.LoginButton>Log in</S.LoginButton>

        <S.AccountLink to="/signin">
          <S.NoAccount>계정이 없어요</S.NoAccount>
        </S.AccountLink>

        <S.Divider>혹은</S.Divider>

        <S.AccountLink to="/password-reset">
          <S.NoAccount>비밀번호를 까먹었어요</S.NoAccount>
        </S.AccountLink>
      </S.LoginBox>
    </S.Container>
  );
}
