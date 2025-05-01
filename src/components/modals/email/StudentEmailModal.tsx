import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sendcode, verifycode } from "../../../api/auth/auth";
import { updateStudentEmail } from "../../../api/profile/api";

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

export default function StudentEmailModal({ onClose, onComplete }: Props) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (timer > 0 && !intervalId) {
      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setIntervalId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
    }
  }, [timer]);

  const handleSendCode = async () => {
    if (!email.includes("@chosun.ac.kr") && !email.includes("@chosun.kr")) {
      alert("조선대 이메일만 인증할 수 있어요.");
      return;
    }
    try {
      await sendcode(email);
      setTimer(300);
      setIsVerified(false);
      if (intervalId) clearInterval(intervalId);
    } catch {
      alert("인증 코드 전송 실패");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const result = await verifycode(email, code);
      if (result === "Email verified successfully") {
        setIsVerified(true);
        alert("인증 완료되었습니다.");
      } else {
        alert("인증 실패");
      }
    } catch {
      alert("인증 오류 발생");
    }
  };

  const handleSave = async () => {
    try {
      await updateStudentEmail(email);
      alert("이메일이 저장되었습니다.");
      onComplete(); // 저장 완료 후 콜백
    } catch {
      alert("저장 실패");
    }
  };

  const formatTime = (time: number) =>
    `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">재학생 이메일 인증</h3>

        <label className="block text-sm font-semibold mb-1">학교 이메일</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isVerified}
          placeholder="example@chosun.ac.kr"
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
        />

        <div className="mb-4 flex items-center">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증번호 입력"
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
          />
          {timer > 0 && <span className="ml-3 text-sm text-gray-500">{formatTime(timer)}</span>}
        </div>

        {!isVerified && (
          <button
            onClick={handleVerifyCode}
            className="w-full mb-3 bg-blue-900 text-white py-2 rounded hover:bg-blue-950"
          >
            인증번호 확인
          </button>
        )}

        {isVerified && (
          <button
            onClick={handleSave}
            className="w-full mb-3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            저장하기
          </button>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            닫기
          </button>
          <button
            onClick={handleSendCode}
            className="px-4 py-2 bg-blue-900 text-white rounded"
          >
            {timer > 0 ? "다시 보내기" : "코드 보내기"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
