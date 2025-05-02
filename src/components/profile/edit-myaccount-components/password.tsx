import React, { useState, useEffect } from "react";
import PasswordSummary from "../edit-myaccount-components/password-summary";
import ChangePasswordModal from "../password-modal/change-password-modal";
import { getMemberProfile } from "../../../api/profile/api"; // ← 비밀번호 길이 가져오는 API

export default function AccountPassword() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLength, setPasswordLength] = useState<number | null>(null);

  useEffect(() => {
    const fetchPasswordLength = async () => {
      try {
        const data = await getMemberProfile();
        setPasswordLength(data.memberPasswordLength);
      } catch (err) {
        console.error("비밀번호 길이 가져오기 실패", err);
      }
    };
    fetchPasswordLength();
  }, []);

  return (
    <div className="mb-8">
      {passwordLength !== null && (
        <PasswordSummary
          onEdit={() => setShowPasswordModal(true)}
          passwordLength={passwordLength}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
