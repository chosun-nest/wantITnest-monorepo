import AccountPassword from "./edit-myaccount-components/password";
import AccountEmailVerification from "./edit-myaccount-components/EmailVerification";
import Withdraw from "./withdraw";

export default function EditMyAccount() {
  return (
    <div className="max-w-2xl p-10 mx-auto bg-white shadow rounded-xl">
      <h2 className="mb-4 text-xl font-bold text-blue-900">계정 관리</h2>

      {/* 비밀번호 변경하기 */}
      <AccountPassword />

      {/* 재학생 이메일 인증하기 */}
      <AccountEmailVerification />

      {/* 탈퇴하기 */}
      <div className="pt-8 mt-12 border-t">
        <Withdraw />
      </div>

      
    </div>
  );
}
