import React, { useState } from "react";

export default function AccountPassword() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const getMaskedPassword = (pw: string) => "*".repeat(pw.length);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordEditing, setPasswordEditing] = useState(false);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);

  const hasTwoCharTypes = /(?=.*[a-zA-Z])(?=.*[\d\W]).*/.test(passwords.new);
  const isLengthValid = /^.{8,32}$/.test(passwords.new) && !/\s/.test(passwords.new);
  const hasNoRepeatedChars = !/(.)\1\1/.test(passwords.new);
  const isPasswordValid =
    hasTwoCharTypes && isLengthValid && hasNoRepeatedChars && passwords.new === passwords.confirm;

  return (
    <div className="mb-8">
      <label className="text-sm font-semibold">현재 비밀번호</label>
      <input
        type={isPasswordVisible ? "text" : "password"}
        value={isPasswordSaved ? "**********" : passwords.current}
        onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
        disabled={isPasswordSaved}
        className="block w-full bg-gray-100 p-2 rounded mt-1"
      />
      {!isPasswordSaved && (
        <p className="text-xs text-gray-500 mt-1">
          확인을 위해 현재 비밀번호를 다시 입력해 주세요.
        </p>
      )}

      {isPasswordEditing && (
        <>
          <div className="mt-4">
            <label className="text-sm font-semibold">새 비밀번호</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
              className="block w-full p-2 border rounded mt-1"
            />
            <ul className="text-xs mt-2 space-y-1">
              <li className={hasTwoCharTypes ? "text-blue-600" : "text-red-500"}>✓ 영문/숫자/특수문자 중 2가지 이상 포함</li>
              <li className={isLengthValid ? "text-blue-600" : "text-red-500"}>✓ 8자 이상 32자 이하 입력 (공백 제외)</li>
              <li className={hasNoRepeatedChars ? "text-blue-600" : "text-red-500"}>✓ 연속 3자 이상 동일한 문자/숫자 제외</li>
            </ul>
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold">새 비밀번호 확인</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
              className="block w-full p-2 border rounded mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              확인을 위해 새 비밀번호를 다시 입력해주세요.
            </p>
          </div>
        </>
      )}

      <div className="text-right mt-4">
        {isPasswordEditing ? (
          <>
            <button
              onClick={() => {
                setPasswordEditing(false);
                setPasswords({ current: "", new: "", confirm: "" });
              }}
              className="px-4 py-2 mr-2 rounded border"
            >
              취소
            </button>
            <button
              onClick={() => {
                // TODO: 비밀번호 변경 API 연동
                console.log("비밀번호 저장:", passwords);
                setPasswordEditing(false);
                setIsPasswordSaved(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={!isPasswordValid}
            >
              저장
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setPasswordEditing(true);
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