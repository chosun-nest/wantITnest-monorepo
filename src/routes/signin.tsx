import * as S from "../assets/styles/login.styles";
import useResponsive from "../hooks/responsive";
import { useState } from "react";

export default function SignIn() {
  const isMobile = useResponsive(); // 가로/세로 상태 감지
  const [selected, setSelected] = useState<"재학생" | "일반">("재학생");
  return (
    <S.Container>
      {/* 로고 위치를 동적으로 조절 */}
      <S.Header $isMobile={isMobile}>
        <S.LogoText>CHOSUN-NEST</S.LogoText>
      </S.Header>
      <S.LoginBox>
        {/*헤더 박스*/}
        <S.HeaderBox>
          <S.HeaderLogo src="/assets/images/logo.png" />
          <S.Title>Welcome to WantIT-NEST</S.Title>
          <S.SigninTitle>회원가입</S.SigninTitle>
        </S.HeaderBox>
        {/*학생 및 일반 구분*/}
        <S.DivisionContainer>
          <S.SigninText>구분</S.SigninText>
          <S.RadioGroup>
            <S.RadioLabel>
              <S.RadioInput
                type="radio"
                name="userType"
                value="재학생"
                checked={selected === "재학생"}
                onChange={() => setSelected("재학생")}
              />
              재학생
            </S.RadioLabel>
            <S.RadioLabel>
              <S.RadioInput
                type="radio"
                name="userType"
                value="일반"
                checked={selected === "일반"}
                onChange={() => setSelected("일반")}
              />
              일반
            </S.RadioLabel>
          </S.RadioGroup>
        </S.DivisionContainer>
        {/* 이메일 및 비밀번호 입력 */}
        <S.SigninBox>
          {" "}
          <S.SigninText>이메일 인증</S.SigninText>
          <S.Input type="email" placeholder="example@chosun.ac.kr" />
          <S.AuthCodeButton>인증코드 보내기</S.AuthCodeButton>
          <S.SigninText>비밀번호</S.SigninText>
          <S.Input type="password" placeholder="*********" />
          <S.SubTextBox>
            <S.SubText>✓ 영문/숫자/특수문자 중, 2가지 이상 포함</S.SubText>
            <S.SubText>✓ 영문/숫자/특수문자 중, 2가지 이상 포함</S.SubText>
            <S.SubText>✓ 영문/숫자/특수문자 중, 2가지 이상 포함</S.SubText>
          </S.SubTextBox>
          <S.SigninText>비밀번호 확인</S.SigninText>
          <S.Input type="password" placeholder="*********" />
          <S.AccountLink to="/create-profile">
            <S.LoginButton>Sign in</S.LoginButton>
          </S.AccountLink>
        </S.SigninBox>
      </S.LoginBox>
    </S.Container>
  );
}
