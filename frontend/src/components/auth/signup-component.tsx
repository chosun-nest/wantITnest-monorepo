import { useEffect } from "react";
import * as S from "../../assets/styles/auth.styles";
import { SignUpComponentProps } from "../../types/signup";

export default function SignUpComponent({
  email,
  onChangeEmail,
  authCode,
  onChangeAuthCode,
  handleSendCode,
  handleVerifyCode,
  timer,
  password,
  onChangePassword,
  confirmPassword,
  onChangeConfirmPassword,
  isPasswordVisible,
  setIsPasswordVisible,
  onNext,
  getItems,
  isEmailVerified,
}: SignUpComponentProps) {
  const hasTwoCharTypes =
    /(?=(?:.*[a-zA-Z])(?:.*[0-9!@#$%^&*()\-_=+{};:,<.>])|(?:.*[0-9])(?:.*[a-zA-Z!@#$%^&*()\-_=+{};:,<.>])|(?:.*[!@#$%^&*()\-_=+{};:,<.>])(?:.*[a-zA-Z0-9])).{2,}/.test(
      password
    );
  const isLengthValid = /^.{8,32}$/.test(password) && !/\s/.test(password);
  const hasNoRepeatedChars = !/(.)\1\1/.test(password);
  const isConfirmMatch = confirmPassword !== "" && password === confirmPassword;
  const formatTime = (time: number) =>
    `${String(Math.floor(time / 60))}:${String(time % 60).padStart(2, "0")}`;
  // 비밀번호 유효성 검사
  const isPasswordValid =
    hasTwoCharTypes && isLengthValid && hasNoRepeatedChars && isConfirmMatch;

  useEffect(() => {
    if (timer === 0) {
      onChangeAuthCode("");
    }
  }, [timer, onChangeAuthCode]);

  // 혹시나 뚫을까봐 막아둔 코드
  const handleNextClick = () => {
    if (!isPasswordValid) {
      alert("비밀번호 조건을 모두 만족해야 합니다.");
      return;
    }

    onNext();
  };

  return (
    <S.LoginBox>
      <S.HeaderBox>
        <S.HeaderLogo src="/assets/images/logo.png" />
        <S.Title>Welcome to WantIT-NEST</S.Title>
        <S.SigninTitle>회원가입</S.SigninTitle>
      </S.HeaderBox>
      <S.SigninText>이메일 인증</S.SigninText>
      <S.EmailRow>
        <S.Input
          type="email"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          placeholder="example@chosun.ac.kr"
          disabled={isEmailVerified}
        />

        {!isEmailVerified && timer <= 0 && (
          <S.AuthCodeButton onClick={handleSendCode}>
            인증코드 보내기
          </S.AuthCodeButton>
        )}
      </S.EmailRow>

      {!isEmailVerified && timer > 0 && (
        <>
          <S.TimerInputWrapper>
            <S.Input
              type="text"
              placeholder="인증번호 입력"
              value={authCode}
              onChange={(e) => onChangeAuthCode(e.target.value)}
            />
            <S.TimerText>{formatTime(timer)}</S.TimerText>
          </S.TimerInputWrapper>

          {/* 인증번호 확인하기 버튼 */}
          <S.CheckCodeButton onClick={handleVerifyCode}>
            인증번호 확인하기
          </S.CheckCodeButton>
        </>
      )}

      {isEmailVerified && (
        <div
          style={{ marginTop: "10px", color: "#4CAF50", fontWeight: "bold" }}
        >
          이메일 인증 완료
        </div>
      )}

      <S.SigninText>비밀번호</S.SigninText>
      <S.PasswordInputWrapper
        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
      >
        <S.Input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="*********"
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
        />
        <S.EyeIcon>
          <svg
            data-Slot="icon"
            fill="none"
            strokeWidth={1.5}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {isPasswordVisible ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            )}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </S.EyeIcon>
      </S.PasswordInputWrapper>
      <S.SubTextBox>
        <S.SubText $isValid={hasTwoCharTypes}>
          ✓ 영문/숫자/특수문자 중, 2가지 이상 포함
        </S.SubText>
        <S.SubText $isValid={isLengthValid}>
          ✓ 8자 이상 32자 이하 입력 (공백 제외)
        </S.SubText>
        <S.SubText $isValid={hasNoRepeatedChars}>
          ✓ 연속 3자 이상 동일한 문자/숫자 제외
        </S.SubText>
      </S.SubTextBox>
      <S.SigninText>비밀번호 확인</S.SigninText>
      <S.Input
        type="password"
        placeholder="*********"
        value={confirmPassword}
        onChange={(e) => onChangeConfirmPassword(e.target.value)}
      />
      {!isConfirmMatch && (
        <S.SubText $isValid={false}>비밀번호가 일치하지 않습니다.</S.SubText>
      )}
      <S.ButtonRow>
        <S.LoginButton
          disabled={!(isPasswordValid && isEmailVerified)}
          onClick={() => {
            handleNextClick();
            getItems();
          }}
        >
          다음
        </S.LoginButton>
      </S.ButtonRow>
      <div className="flex justify-center mb-[50px]">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span>이미 계정이 있나요?</span>
          <a href="/login" className="text-blue-500 hover:underline">
            로그인 하기
          </a>
        </div>
      </div>
    </S.LoginBox>
  );
}
