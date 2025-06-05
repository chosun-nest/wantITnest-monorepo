// 계정 탈퇴 페이지
import {useState} from "react";
import { withdrawMember } from "../../../../api/profile/api";
import WithdrawModal from "./WithdrawModal";
import WithdrawCompleteModal from "./WithdrawCompleteModal";


export default function Withdraw(){
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);  // 탈퇴하기 버튼 누른 후 모달
  const [showCompleteModal, setShowCompleteModal] = useState(false);  // 탈퇴 완료 모달


  const handleWithdraw = async () => {
    try {
      await withdrawMember(); // 탈퇴 API 호출
      localStorage.removeItem("accesstoken"); // 토큰 삭제
      setShowWithdrawModal(false);
      setShowCompleteModal(true);   // 회원 탈퇴 완료 모달 띄우기
    } catch (err) {
      console.error("회원 탈퇴 실패", err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="mb-4 text-right">
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-4 py-2 text-white bg-gray-500 rounded"
        >
          계정 탈퇴하기 &gt;
        </button>
      </div>

      { /* 계정 탈퇴 모달 띄우기 */}
      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => setShowWithdrawModal(false)}
          onConfirm={handleWithdraw}  // 탈퇴 API 호출
        />
      )}

      { /* 계정 탈퇴 완료 모달 띄우기 */}
      {showCompleteModal && (
        <WithdrawCompleteModal onClose={() => setShowCompleteModal(false)} />
      )}
    </>
  );
}
