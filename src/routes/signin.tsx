import { useState } from "react";
import * as S from "../assets/styles/login.styles";
import SigninComponent from "../components/auth/signin-component";
import SigninDetail from "../components/auth/signin-deatil";

export default function SignIn() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<"재학생" | "일반">("재학생");

  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSendCode = () => {
    setTimer(300);
    if (intervalId) clearInterval(intervalId);

    const newInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(newInterval);
          setIntervalId(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(newInterval);
  };

  const handleNextStep = () => setStep(2);
  const handlePrevStep = () => setStep(1);

  return (
    <S.Container>
      {step === 1 ? (
        <SigninComponent
          selected={selected}
          onChangeSelected={setSelected}
          email={email}
          onChangeEmail={setEmail}
          authCode={authCode}
          onChangeAuthCode={setAuthCode}
          handleSendCode={handleSendCode}
          timer={timer}
          password={password}
          onChangePassword={setPassword}
          confirmPassword={confirmPassword}
          onChangeConfirmPassword={setConfirmPassword}
          isPasswordVisible={isPasswordVisible}
          setIsPasswordVisible={setIsPasswordVisible}
          onNext={handleNextStep}
        />
      ) : (
        <SigninDetail selected={selected} onPrev={handlePrevStep} />
      )}
    </S.Container>
  );
}
