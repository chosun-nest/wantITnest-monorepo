import { Link } from "react-router-dom";
import * as S from "../assets/styles/auth.styles";
import useResponsive from "../hooks/responsive";
import { useState } from "react";
import { ModalContent } from "../types/modal";
import Modal from "../components/common/modal";

export default function PasswdReset() {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  const isMobile = useResponsive();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendEmail = async () => {
    if (!isEmailValid) {
      setModalContent({
        title: "이메일 형식 오류",
        message: "이메일 형식이 올바르지 않습니다.",
        type: "error",
      });
      setShowModal(true);
      return;
    }
    console.log("이메일 전송");
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
      <div className="mb-4" />
      <S.LoginBox>
        <span className="text-sm text-gray-600 mb-2 font-semibold font-pretendard">
          입력한 이메일이 사용자 데이터 베이스에 존재하면
          <br /> 비밀번호를 재설정할 수 있는 이메일을 보내드립니다.
        </span>
        <div className="mb-8" />
        <S.Input
          type="email"
          placeholder="want@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <S.LoginButton onClick={handleSendEmail}>이메일 보내기</S.LoginButton>
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
