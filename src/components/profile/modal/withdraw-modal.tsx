import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function WithdrawModal({ onClose, onConfirm }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const isFormValid = agreed && isPasswordValid;

  const mockVerifyPassword = (pw: string) => {
    // 실제 API 연동 전까지 임시 검증 로직 (나중에 서버 검증으로 대체 가능)
    setIsPasswordValid(pw === "test1234");
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    mockVerifyPassword(val);
  };

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-3">둥지를 떠난다니 아쉽네요.</h3>

        <p className="text-sm text-red-500 mb-4">회원탈퇴 전 안내사항을 읽어보세요:</p>
        <ul className="list-disc pl-5 text-sm text-gray-700 mb-4 space-y-1">
          <li>회원 탈퇴 시, 더 이상 해당 계정으로 WantIT-Nest 사용이 불가능합니다.</li>
          <li>
            직접 작성한 콘텐츠(사진, 게시물, 댓글 등)는 자동으로 삭제되지 않으며,
            삭제를 원하시면 탈퇴 이전에 삭제해 주세요.
          </li>
        </ul>

        <div className="mb-4">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mr-2"
            />
            안내사항을 모두 확인했습니다.
          </label>
        </div>

        <AnimatePresence>
          {agreed && (
            <motion.div
              key="password-field"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                placeholder="현재 비밀번호를 입력하세요"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
              />
              {password.length > 0 && (
                <p className={`mt-2 text-sm ${isPasswordValid ? "text-green-600" : "text-red-500"}`}>
                  {isPasswordValid ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 border rounded"
          >
            닫기
          </button>
          <button
            onClick={() => onConfirm(password)}
            disabled={!isFormValid}
            className={`px-4 py-2 rounded text-white ${
              isFormValid ? "bg-blue-900 hover:bg-blue-950" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}
