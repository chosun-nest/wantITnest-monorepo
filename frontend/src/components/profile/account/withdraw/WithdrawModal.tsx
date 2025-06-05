// 계정 탈퇴 모달
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { checkPassword } from "../../../../api/profile/api";
import LoadingDots from "../../../ui/LoadingDots";
import CheckIcon from "../../../ui/CheckIcon";

interface Props {
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function WithdrawModal({ onClose, onConfirm }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 안내사항 + 비밀번호 검증이 모두 통과해야 버튼 활성화 됨
  const isFormValid = agreed && isVerified === true;

  const handleVerify = async () => {
    setError(null);
    if (!password) return;
    setIsChecking(true);

    try {
      const res = await checkPassword({ password });
      if (res.status === 200) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
        setError("비밀번호가 일치하지 않습니다.");
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
        <h3 className="mb-3 text-lg font-bold text-gray-800">둥지를 떠난다니 아쉽네요.</h3>

        <p className="mb-4 text-sm text-red-500">회원탈퇴 전 안내사항을 읽어보세요:</p>
        <ul className="pl-5 mb-4 space-y-1 text-sm text-gray-700 list-disc">
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
              onChange={() => setAgreed((prev) => !prev)}
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
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                비밀번호 확인
              </label>

              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="현재 비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleVerify}
                  className="w-full p-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-800"
                  disabled={isChecking || isVerified === true}
                />

                {/* 숨기기/보기 토글 */}
                <button
                  type="button"
                  className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2"
                  onClick={() => setShowPwd((prev) => !prev)}
                >
                  {showPwd ? "🔒" : "👁️"}
                </button>

                {/* 로딩, 체크 아이콘 */}
                <div className="absolute inset-y-0 flex items-center pr-2 right-10">
                  {isChecking
                    ? <LoadingDots />
                    : isVerified
                      ? <CheckIcon />
                      : null}
                </div>
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 border rounded hover:bg-gray-100"
          >
            닫기
          </button>
          <button
            onClick={() => onConfirm(password)}
            disabled={!isFormValid}
            className={`px-4 py-2 rounded text-white ${
              isFormValid ? "bg-red-700 hover:bg-red-800" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}
