import React, { useState } from "react";

export default function Account() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const getMaskedPassword = (pw: string) => "*".repeat(pw.length);  //비밀번호 마스킹 처리 * 개수 조절
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false); // 저장 여부

  // 비밀번호 변경할 때 문자 형식 맞는지 확인
  const hasTwoCharTypes = /(?=.*[a-zA-Z])(?=.*[\d\W]).*/.test(passwords.new);
  const isLengthValid = /^.{8,32}$/.test(passwords.new) && !/\s/.test(passwords.new);
  const hasNoRepeatedChars = !/(.)\1\1/.test(passwords.new);

  // 전체 저장 버튼 활성화 조건 확인하기 위함.
  const isPasswordValid =
  hasTwoCharTypes &&
  isLengthValid &&
  hasNoRepeatedChars &&
  passwords.new === passwords.confirm;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>

      {/* 현재 비밀번호 */}
      <div className="mb-4">
        <label className="text-sm font-semibold">현재 비밀번호</label>
        <input
          type={isPasswordVisible ? "text" : "password"}
          value={isPasswordSaved ? "**********" : passwords.current} 
          onChange={(e) =>
            setPasswords((prev) => ({ ...prev, current: e.target.value }))
          }
          disabled={isPasswordSaved}
          className="block w-full bg-gray-100 p-2 rounded mt-1"
        />
        {!isPasswordSaved && (
          <p className="text-xs text-gray-500 mt-1">
            확인을 위해 현재 비밀번호를 다시 입력해 주세요.
          </p>
        )}
      </div>

      {/* 새 비밀번호 & 확인 */}
      {isEditing && (
        <>
          <div className="mb-4">
            <label className="text-sm font-semibold">새 비밀번호</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={passwords.new}
              onChange={(e) =>
                setPasswords((prev) => ({ ...prev, new: e.target.value }))
              }
              className="block w-full p-2 border rounded mt-1"
            />
            <ul className="text-xs mt-2 space-y-1">
                <li className={hasTwoCharTypes ? "text-blue-600" : "text-red-500"}>
                    ✓ 영문/숫자/특수문자 중 2가지 이상 포함
                </li>
                <li className={isLengthValid ? "text-blue-600" : "text-red-500"}>
                    ✓ 8자 이상 32자 이하 입력 (공백 제외)
                </li>
                <li className={hasNoRepeatedChars ? "text-blue-600" : "text-red-500"}>
                    ✓ 연속 3자 이상 동일한 문자/숫자 제외
                </li>
            </ul>
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold">새 비밀번호 확인</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  confirm: e.target.value,
                }))
              }
              className="block w-full p-2 border rounded mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              확인을 위해 새 비밀번호를 다시 입력해주세요.
            </p>
          </div>
        </>
      )}

      {/* 버튼 영역 */}
      <div className="text-right mt-4">
        {isEditing ? (
          <>
            <button
              onClick={() => {
                setIsEditing(false);
                setPasswords({ current: "", new: "", confirm: "" });
              }}
              className="px-4 py-2 mr-2 rounded border"
            >
              취소
            </button>
            <button
              onClick={() => {
                // TODO: 서버 연동
                console.log("비밀번호 저장:", passwords);
                setIsEditing(false);
                setIsPasswordSaved(true); // 마스킹 처리
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={!isPasswordValid}>
              저장
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setIsEditing(true);
              setIsPasswordSaved(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            설정
          </button>
        )}
      </div>
    </div>
  );
}
