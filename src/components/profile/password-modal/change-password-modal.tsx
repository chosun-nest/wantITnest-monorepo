import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { checkPassword, updateMemberPassword } from "../../../api/profile/api";
import LoadingDots from "./loading-dots";
import CheckIcon from "./check-icon";
import PasswordSuccessModal from "./password-success-modal";

interface Props {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isChecking, setIsChecking] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 비밀번호 유효성 검사
  const hasTwoCharTypes =
    /(?=(?:.*[a-zA-Z])(?:.*[0-9!@#$%^&*()\-_=+{};:,<.>])|(?:.*[0-9])(?:.*[a-zA-Z!@#$%^&*()\-_=+{};:,<.>])|(?:.*[!@#$%^&*()\-_=+{};:,<.>])(?:.*[a-zA-Z0-9])).{2,}/.test(newPassword);
  const isLengthValid = /^.{8,32}$/.test(newPassword) && !/\s/.test(newPassword);
  const hasNoRepeatedChars = !/(.)\1\1/.test(newPassword);
  const isConfirmMatch = confirmPassword !== "" && newPassword === confirmPassword;
  const isPasswordValid = hasTwoCharTypes && isLengthValid && hasNoRepeatedChars && isConfirmMatch;

  const verifyPassword = async () => {
    if (!currentPassword) return;
    setIsChecking(true);
    try {
      const response = await checkPassword({ password: currentPassword });
      const isCorrect = response.data.success;  // 또는 response.data.isCorrect, 서버에 따라 다름
  
      if (isCorrect) {
        setIsPasswordVerified(true);
      } else {
        setIsPasswordVerified(false);
      }
    } catch {
      setIsPasswordVerified(false);
    } finally {
      setIsChecking(false);
    }
  };
  

  const handleSave = async () => {
    try {
      await updateMemberPassword({
        currentPassword,
        newPassword,
        newPasswordConfirm: confirmPassword,
      });
      setShowPasswordModal(true); // 비밀번호 변경 시 성공 모달 띄우기
    } catch {
      alert("비밀번호 변경 실패");
    }
  };

  const isNextEnabled = isPasswordVerified === true;
  const isSaveEnabled = isPasswordVerified === true && isPasswordValid;

  if (showPasswordModal) {
    return <PasswordSuccessModal onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">비밀번호 변경</h3>

              <div className="relative">
                <label className="block text-sm font-semibold mb-1">현재 비밀번호</label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  onBlur={verifyPassword}
                  className="w-full p-2 mb-3 border rounded focus:ring-1 focus:ring-blue-700 focus:border-blue-800 pr-10"
                  placeholder="현재 비밀번호 입력"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  {isChecking ? <LoadingDots /> : isPasswordVerified ? <CheckIcon /> : null}
                </div>
              </div>

              <button
                type="button"
                className="text-xs text-gray-500 mb-2"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
              >
                {showCurrentPassword ? "🔒 숨기기" : "👁️ 보기"}
              </button>

              <div className="flex justify-end mt-6 gap-2">
                <button onClick={onClose} className="px-4 py-2 border rounded">
                  닫기
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!isNextEnabled}
                  className={`px-4 py-2 rounded text-white ${
                    isNextEnabled ? "bg-blue-900 hover:bg-blue-950" : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  다음
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">새 비밀번호 설정</h3>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 mb-3 border rounded focus:ring-1 focus:ring-blue-700 focus:border-blue-800 pr-10"
                  placeholder="새 비밀번호 입력"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-sm text-gray-400"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? "🔒" : "👁️"}
                </button>
              </div>

              {/* 비밀번호 조건 */}
              <div className="mb-3 text-sm">
                <p className={hasTwoCharTypes ? "text-green-600" : "text-gray-500"}>✓ 영문/숫자/특수문자 2종 이상</p>
                <p className={isLengthValid ? "text-green-600" : "text-gray-500"}>✓ 8자 이상 32자 이하</p>
                <p className={hasNoRepeatedChars ? "text-green-600" : "text-gray-500"}>✓ 연속 3자 이상 반복 금지</p>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 mb-3 border rounded focus:ring-1 focus:ring-blue-700 focus:border-blue-800 pr-10"
                  placeholder="새 비밀번호 재입력"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-sm text-gray-400"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? "🔒" : "👁️"}
                </button>
              </div>

              {/* 확인 일치 여부 */}
              {confirmPassword && (
                <p className={`text-sm ${isConfirmMatch ? "text-green-600" : "text-red-500"}`}>
                  {isConfirmMatch ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}
                </p>
              )}

              <div className="flex justify-end mt-6 gap-2">
                <button onClick={() => setStep(1)} className="px-4 py-2 border rounded">
                  뒤로
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isSaveEnabled}
                  className={`px-4 py-2 rounded text-white ${
                    isSaveEnabled ? "bg-blue-900 hover:bg-blue-950" : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  변경하기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
