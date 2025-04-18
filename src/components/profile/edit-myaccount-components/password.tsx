import React, { useState } from "react";
import PasswordSummary from "./password-summary";
import PasswordVerify from "./passwordVerify";
import PasswordChangeForm from "./password-changeform";
import { AnimatePresence } from "framer-motion";
import { updateMemberPassword } from "../../../api/profile/api"; // password API 호출

export default function AccountPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const PasswordLength = 10; // TODO: 서버 연동으로 교체

  const handleChange = (field: "current" | "new" | "confirm", value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerify = async () => {
    if (passwords.current === "test1234") {
      alert("✅ (임시) 비밀번호 확인 성공");
      setStep(3);
    } else {
      alert("❌ (임시) 비밀번호가 올바르지 않습니다.");
    }
  };

  // const handleVerify = async () => {
  //   try {
  //     await API.post("/api/v1/members/check-password", { password: passwords.current });
  //     setStep(3);
  //   } catch {
  //     alert("현재 비밀번호가 올바르지 않습니다.");
  //   }
  // };


  const handleSave = async () => {
    try {
      await updateMemberPassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        newPasswordConfirm: passwords.confirm,
      });
      alert("비밀번호가 변경되었습니다.");
      setStep(1);
      setPasswords({ current: "", new: "", confirm: "" });
    } catch {
      alert("비밀번호 변경 실패");
    }
  };

  const handleCancel = () => {
    setStep(1);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="mb-8">
      {step === 1 && (
        <PasswordSummary
          onEdit={() => setStep(2)}
          passwordLength={PasswordLength}
        />
      )}

      {step === 2 && (
        <PasswordVerify
          value={passwords.current}
          onChange={(val) => handleChange("current", val)}
          onNext={handleVerify}
          onBack={handleCancel}
        />
      )}

      <AnimatePresence mode="wait">
        {step === 3 && (
          <PasswordChangeForm
            key="step3"
            passwords={passwords}
            onChange={(field, val) => handleChange(field, val)}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
