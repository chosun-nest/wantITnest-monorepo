import { useState, useEffect } from "react";
import * as S from "../assets/styles/auth.styles";
import SignUpComponent from "../components/auth/signup-component";
import SignUpDetail from "../components/auth/signup-deatil";
import { sendcode, signup, verifycode } from "../api/auth/auth";
import { useNavigate } from "react-router-dom";
import { getDepartments, getInterests, getTech } from "../api/common/common";
import { Item } from "../types/signup";

export default function SignUp() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<"재학생" | "일반">("재학생");

  const [email, setEmail] = useState("");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [authCode, setAuthCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [name, setName] = useState("");
  const [department, setDepartment] = useState<Item | null>(null);
  const [interest, setInterest] = useState<Item[]>([]);
  const [skills, setSkills] = useState<Item[]>([]);

  const [techList, setTechList] = useState<Item[]>([]);
  const [interestsList, setInterestsList] = useState<Item[]>([]);
  const [departmentsList, setDepartmentsList] = useState<Item[]>([]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      const techResponse = await getTech();
      const interestsResponse = await getInterests();
      const departmentsResponse = await getDepartments();

      setTechList(
        techResponse.map(
          (item: { techStackId: number; techStackName: string }) => ({
            id: item.techStackId,
            name: item.techStackName,
          })
        )
      );
      setInterestsList(
        interestsResponse.map(
          (item: { interestId: number; interestName: string }) => ({
            id: item.interestId,
            name: item.interestName,
          })
        )
      );
      setDepartmentsList(
        departmentsResponse.map(
          (item: { departmentId: number; departmentName: string }) => ({
            id: item.departmentId,
            name: item.departmentName,
          })
        )
      );
    } catch (e) {
      console.error("아이템 불러오기 실패:", e);
    }
  };

  const handleSendCode = async () => {
    if (!isEmailValid) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    try {
      await sendcode(email);
      setIsEmailVerified(false);
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
      alert("인증코드가 전송되었습니다!");
    } catch (error) {
      console.error("인증코드 전송 실패:", error);
      alert("인증코드 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await verifycode(email, authCode);
      console.log("응답 데이터:", res);

      if (res === "Email verified successfully") {
        alert("이메일 인증 성공!");
        setIsEmailVerified(true);
      } else {
        alert("이메일 인증 실패!");
        setIsEmailVerified(false);
      }
    } catch (e) {
      console.error("이메일 인증 실패:", e);
      alert("이메일 인증 중 오류가 발생했습니다.");
    }
  };

  const handleSignup = async () => {
    try {
      const payload = {
        email,
        password,
        memberName: name,
        memberIsStudent: selected === "재학생",
        departmentIdList: department ? [department.id] : [],
        interestIdList: interest.length > 0 ? interest.map((i) => i.id) : [],
        techStackIdList: skills.length > 0 ? skills.map((i) => i.id) : [],
      };

      console.log("회원가입 payload:", payload);
      const res = await signup(payload);

      const { accessToken, refreshToken, memberId, email: userEmail } = res;
      localStorage.setItem("accesstoken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({ memberId, email: userEmail })
      );

      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleNextStep = () => setStep(2);
  const handlePrevStep = () => setStep(1);

  return (
    <S.Container>
      {step === 1 ? (
        <SignUpComponent
          selected={selected}
          onChangeSelected={setSelected}
          email={email}
          onChangeEmail={setEmail}
          authCode={authCode}
          onChangeAuthCode={setAuthCode}
          handleSendCode={handleSendCode}
          handleVerifyCode={handleVerifyCode}
          timer={timer}
          password={password}
          onChangePassword={setPassword}
          confirmPassword={confirmPassword}
          onChangeConfirmPassword={setConfirmPassword}
          isPasswordVisible={isPasswordVisible}
          setIsPasswordVisible={setIsPasswordVisible}
          onNext={handleNextStep}
          getItems={getItems}
          isEmailVerified={isEmailVerified}
        />
      ) : (
        <SignUpDetail
          selected={selected}
          onPrev={handlePrevStep}
          name={name}
          onChangeName={setName}
          department={department}
          onChangeDepartment={setDepartment}
          interest={interest}
          onChangeInterest={setInterest}
          skills={skills}
          onChangeSkills={setSkills}
          onSubmit={handleSignup}
          techList={techList}
          interestsList={interestsList}
          departmentsList={departmentsList}
        />
      )}
    </S.Container>
  );
}
