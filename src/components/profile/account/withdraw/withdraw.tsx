// 계정 탈퇴 페이지
import {useState} from "react";
import { useDispatch } from "react-redux";
import { withdrawMember } from "../../../../api/profile/api";
import WithdrawModal from "./WithdrawModal";
import WithdrawCompleteModal from "./WithdrawCompleteModal";
import { clearTokens } from "../../../../store/slices/authSlice";

export default function Withdraw(){
  const dispatch = useDispatch();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);  // 탈퇴하기 버튼 누른 후 모달
  const [showCompleteModal, setShowCompleteModal] = useState(false);  // 탈퇴 완료 모달


  const handleWithdraw = async () => {
    try {
      await withdrawMember(); // 탈퇴 API 호출
      
      // 로컬 스토리지 토큰 삭제
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshToken");

      // Redux 상태 초기화
      dispatch(clearTokens());

      setShowWithdrawModal(false);
      setShowCompleteModal(true);
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
          onConfirm={handleWithdraw} // password 인자 제거
        />
      )}
      
      { /* 계정 탈퇴 완료 모달 띄우기 */}
      {showCompleteModal && (
        <WithdrawCompleteModal onClose={() => setShowCompleteModal(false)} />
      )}
    </>
  );
}