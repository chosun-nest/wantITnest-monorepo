import * as S from "../../assets/styles/login.styles";

type SigninComponentProps = {
  selected: "재학생" | "일반";
  onChangeSelected: (value: "재학생" | "일반") => void;
  email: string;
  onChangeEmail: (value: string) => void;
  authCode: string;
  onChangeAuthCode: (value: string) => void;
  handleSendCode: () => void;
  timer: number;
  password: string;
  onChangePassword: (value: string) => void;
  confirmPassword: string;
  onChangeConfirmPassword: (value: string) => void;
  isPasswordVisible: boolean;
  setIsPasswordVisible: (visible: boolean) => void;
  onNext: () => void;
};

export default function SigninComponent({
  selected,
  onChangeSelected,
  email,
  onChangeEmail,
  authCode,
  onChangeAuthCode,
  handleSendCode,
  timer,
  password,
  onChangePassword,
  confirmPassword,
  onChangeConfirmPassword,
  isPasswordVisible,
  setIsPasswordVisible,
  onNext,
}: SigninComponentProps) {
  const hasTwoCharTypes =
    /(?=(?:.*[a-zA-Z])(?:.*[0-9!@#$%^&*()\-_=+{};:,<.>])|(?:.*[0-9])(?:.*[a-zA-Z!@#$%^&*()\-_=+{};:,<.>])|(?:.*[!@#$%^&*()\-_=+{};:,<.>])(?:.*[a-zA-Z0-9])).{2,}/.test(
      password
    );
  const isLengthValid = /^.{8,32}$/.test(password) && !/\s/.test(password);
  const hasNoRepeatedChars = !/(.)\1\1/.test(password);
  const isConfirmMatch = confirmPassword === "" || password === confirmPassword;
  const formatTime = (time: number) =>
    `${String(Math.floor(time / 60))}:${String(time % 60).padStart(2, "0")}`;

  return (
    <S.LoginBox>
      <S.HeaderBox>
        <S.HeaderLogo src="/assets/images/logo.png" />
        <S.Title>Welcome to WantIT-NEST</S.Title>
        <S.SigninTitle>회원가입</S.SigninTitle>
      </S.HeaderBox>

      <S.DivisionContainer>
        <S.SigninText>구분</S.SigninText>
        <S.RadioGroup>
          <S.RadioLabel>
            <S.RadioInput
              type="radio"
              name="userType"
              value="재학생"
              checked={selected === "재학생"}
              onChange={() => onChangeSelected("재학생")}
            />
            재학생
          </S.RadioLabel>
          <S.RadioLabel>
            <S.RadioInput
              type="radio"
              name="userType"
              value="일반"
              checked={selected === "일반"}
              onChange={() => onChangeSelected("일반")}
            />
            일반
          </S.RadioLabel>
        </S.RadioGroup>
      </S.DivisionContainer>

      <S.SigninText>이메일 인증</S.SigninText>
      <S.EmailRow>
        <S.Input
          type="email"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          placeholder="example@chosun.ac.kr"
        />
        <S.AuthCodeButton onClick={handleSendCode} disabled={timer > 0}>
          {timer > 0 ? (
            <>
              인증코드
              <br /> 다시 보내기
            </>
          ) : (
            "인증코드 보내기"
          )}
        </S.AuthCodeButton>
      </S.EmailRow>

      {timer > 0 && (
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

          {/* ✅ 인증번호 확인하기 버튼 */}
          <S.CheckCodeButton
            onClick={() => console.log("입력된 인증번호:", authCode)}
          >
            인증번호 확인하기
          </S.CheckCodeButton>
        </>
      )}

      <S.SigninText>비밀번호</S.SigninText>
      <S.PasswordInputWrapper
        onMouseEnter={() => setIsPasswordVisible(true)}
        onMouseLeave={() => setIsPasswordVisible(false)}
      >
        <S.Input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="*********"
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
        />
        <S.EyeIcon>👁️</S.EyeIcon>
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
        <S.LoginButton onClick={onNext}>다음</S.LoginButton>
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
