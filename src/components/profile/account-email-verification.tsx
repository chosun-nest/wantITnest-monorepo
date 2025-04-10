import React, { useEffect, useState } from "react";
import { sendcode, verifycode } from "../../api/auth/auth";

export default function AccountEmailVerification() {
  const [studentEmail, setStudentEmail] = useState("");
  const [studentAuthCode, setStudentAuthCode] = useState("");
  const [studentTimer, setStudentTimer] = useState(0);
  const [studentIntervalId, setStudentIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isStudentEmailVerified, setIsStudentEmailVerified] = useState(false);
  const [isStudentMailEditing, setStudentMailEditing] = useState(false);

  const formatTime = (time: number) => `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (studentTimer === 0 && studentIntervalId) {
      clearInterval(studentIntervalId);
      setStudentIntervalId(null);
    }
  }, [studentTimer, studentIntervalId]);

  const handleSendStudentCode = () => {
    if (!studentEmail.includes("@chosun.ac.kr")) {
      alert("조선대학교 이메일만 인증할 수 있어요.");
      return;
    }
    try {
      setIsStudentEmailVerified(false);
      sendcode(studentEmail);
      setStudentTimer(300);
      if (studentIntervalId) clearInterval(studentIntervalId);
      const newInterval = setInterval(() => {
        setStudentTimer((prev) => {
          if (prev <= 1) {
            clearInterval(newInterval);
            setStudentIntervalId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setStudentIntervalId(newInterval);
    } catch (e) {
      console.error("인증코드 전송 실패", e);
    }
  };

  const handleVerifyStudentCode = async () => {
    try {
      const res = await verifycode(studentEmail, studentAuthCode);
      if (res === "Email verified successfully") {
        alert("인증 성공!");
        setIsStudentEmailVerified(true);
      } else {
        alert("인증 실패");
      }
    } catch (e) {
      console.error("인증 오류", e);
      alert("인증 요청 중 오류 발생");
    }
  };

  const handleSaveStudentEmail = async () => {
    try {
      if (!isStudentEmailVerified) {
        alert("이메일 인증이 완료되지 않았습니다.");
        return;
      }
      // TODO: API.post("/api/v1/member/email", { email: studentEmail });
      alert("이메일이 저장되었습니다!");
      setStudentMailEditing(false);
    } catch (e) {
      alert("이메일 저장 중 오류가 발생했습니다.");
      console.error(e);
    }
  };

  const handleCancel = () => {
    setStudentMailEditing(false);
    setStudentEmail("");
    setStudentAuthCode("");
    setStudentTimer(0);
    setIsStudentEmailVerified(false);
    if (studentIntervalId) {
      clearInterval(studentIntervalId);
      setStudentIntervalId(null);
    }
  };

  return (
    <div className="mt-8 mb-4">
      <label className="text-sm font-semibold">재학생 이메일 인증하기</label>
      {isStudentMailEditing && (
        <>
          <div className="relative mt-2">
            <input
              className="block w-full border p-2 rounded"
              placeholder="example@chosun.ac.kr"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              disabled={isStudentEmailVerified}
            />
          </div>

          <div className="relative mt-4">
            <input
              className="block w-full border p-2 rounded pr-16"
              placeholder="인증번호 입력"
              value={studentAuthCode}
              onChange={(e) => setStudentAuthCode(e.target.value)}
            />
            {studentTimer > 0 && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                {formatTime(studentTimer)}
              </span>
            )}
          </div>

          {!isStudentEmailVerified && studentTimer > 0 && (
            <button
              onClick={handleVerifyStudentCode}
              style={{ backgroundColor: "#002F6C" }}
              className="mt-3 px-4 py-2 text-white rounded"
            >
              인증번호 확인하기
            </button>
          )}

          {isStudentEmailVerified && (
            <>
              <p className="text-green-600 text-sm mt-2">✅ 인증 완료되었습니다</p>
              <button
                onClick={handleSaveStudentEmail}
                className="mt-3 px-4 py-2 bg-green-500 text-white rounded"
              >
                저장
              </button>
            </>
          )}
        </>
      )}

      <div className="text-right mt-4">
        {isStudentMailEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="px-4 py-2 mr-2 rounded border"
            >
              취소
            </button>
            <button
              onClick={handleSendStudentCode}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {studentTimer > 0 ? "다시 보내기" : "인증코드 보내기"}
            </button>
          </>
        ) : (
          <button
            onClick={() => setStudentMailEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            설정
          </button>
        )}
      </div>
    </div>
  );
}
