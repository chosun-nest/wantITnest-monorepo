import React, { useState, useEffect } from "react";
import { getMemberProfile } from "../../../api/profile/api";
import StudentEmailModal from "../../modals/email/StudentEmailModal";

export default function AccountStudentEmail() {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const data = await getMemberProfile();
        setEmail(data.memberEmail || "");
      } catch (e) {
        console.error("이메일 불러오기 실패", e);
      }
    };
    fetchEmail();
  }, []);

  const isStudentEmailVerified = email.endsWith("@chosun.ac.kr") || email.endsWith("@chosun.kr");

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center mb-4">
        <label className="w-36 text-sm font-semibold ">재학생 이메일 인증</label>
        <input
          type="text"
          value={
            isStudentEmailVerified ? "Verified Email🏫" : email
          }
          disabled
          className={`flex-1 bg-gray-100 p-2 rounded" ${
            isStudentEmailVerified ? "text-green-500 font-lightbold" : "text-gray-800"
          }`}
        />
      </div>

      {!isStudentEmailVerified && (
        <div className="text-right mt-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-900 text-white rounded"
          >
            설정
          </button>
        </div>
      )}

      {showModal && (
        <StudentEmailModal
          onClose={() => setShowModal(false)}
          onComplete={async () => {
            const data = await getMemberProfile();
            setEmail(data.memberEmail || "");
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
