import AccountPassword from "./edit-myaccount-components/password";
import AccountEmailVerification from "./edit-myaccount-components/email-verification";
import Withdraw from "./withdraw";

export default function EditMyAccount() {
  return (
    <div className="max-w-2xl mx-auto p-10 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold text-blue-900 mb-4">계정 관리</h2>

      {/* 비밀번호 변경하기 */}
      <AccountPassword />

      {/* 재학생 이메일 인증하기 */}
      <AccountEmailVerification />

      {/* 탈퇴하기 */}
      <div className="border-t mt-12 pt-8">
        <Withdraw />
      </div>
    </div>
  );
}