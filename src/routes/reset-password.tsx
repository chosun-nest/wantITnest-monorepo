import { Link, useNavigate, useSearchParams } from "react-router-dom";

import * as S from "../assets/styles/auth.styles";
import { useState } from "react";
import Modal from "../components/common/modal";
import useResponsive from "../hooks/responsive";
import { ModalContent } from "../types/modal";
import { passwordReset } from "../api/auth/auth";
export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const [password, setPassword] = useState(""); // 바꿀 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // 비밀번호 검사코드
  const hasTwoCharTypes =
    /(?=(?:.*[a-zA-Z])(?:.*[0-9!@#$%^&*()\-_=+{};:,<.>])|(?:.*[0-9])(?:.*[a-zA-Z!@#$%^&*()\-_=+{};:,<.>])|(?:.*[!@#$%^&*()\-_=+{};:,<.>])(?:.*[a-zA-Z0-9])).{2,}/.test(
      password
    );
  const isLengthValid = /^.{8,32}$/.test(password) && !/\s/.test(password);
  const hasNoRepeatedChars = !/(.)\1\1/.test(password);
  const isConfirmMatch = confirmPassword !== "" && password === confirmPassword;
  // 비밀번호 유효성 검사
  const isPasswordValid =
    hasTwoCharTypes && isLengthValid && hasNoRepeatedChars && isConfirmMatch;
  // 여기까지 비밀번호 유효성 검사
  const isMobile = useResponsive();
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  const token = searchParams.get("token");
  const handleSendReset = async () => {
    try {
      await passwordReset(token as string, password);
      setModalContent({
        title: "비밀번호 재설정 성공",
        message: "비밀번호가 성공적으로 재설정 되었습니다.",
        type: "info",
        onClose: () => navigate("/login"),
      });
      setShowModal(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setModalContent({
        title: "비밀번호 재설정 오류",
        message: "비밀번호 재설정에 실패했습니다.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  return (
    <S.Container>
      {showModal && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={() => {
            setShowModal(false);
            modalContent.onClose?.();
          }}
        />
      )}
      <S.Header $isMobile={isMobile}>
        <Link to="/">
          <S.LogoText>WantIT-Nest</S.LogoText>
        </Link>
      </S.Header>
      <div className="mb-2" />
      <span className="text-sm text-gray-600 mb-2 font-semibold font-pretendard">
        새로운 비밀번호로 재설정 해주세요
      </span>
      <S.LoginBox>
        <div className="mb-2" />
        <S.SigninText>새 비밀번호</S.SigninText>
        <S.PasswordInputWrapper
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <S.Input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="새 비밀번호를 입력 해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <S.EyeIcon>👁️</S.EyeIcon>
        </S.PasswordInputWrapper>{" "}
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
        <div className="mb-3" />
        <S.SigninText>새 비밀번호 확인</S.SigninText>
        <S.Input
          type="password"
          placeholder="새 비밀번호를 다시 입력 해주세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />{" "}
        {!isConfirmMatch && (
          <S.SubText $isValid={false}>비밀번호가 일치하지 않습니다.</S.SubText>
        )}
        <S.LoginButton
          disabled={!(isPasswordValid && isConfirmMatch)}
          onClick={handleSendReset}
        >
          재설정 하기
        </S.LoginButton>
        <div className="flex justify-center mb-[50px]">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <a href="/login" className="text-blue-500 hover:underline">
              로그인
            </a>
            <span>으로 돌아가기</span>
          </div>
        </div>
      </S.LoginBox>
    </S.Container>
  );
}
