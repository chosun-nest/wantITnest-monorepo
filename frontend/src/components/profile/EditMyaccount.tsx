import AccountPassword from "./account/password/password";
//import AccountEmailVerification from "./edit-myaccount-components/EmailVerification"; //기능 삭제함
import Withdraw from "./account/withdraw/withdraw";

export default function EditMyAccount() {
  return (
    <div className="max-w-2xl p-10 mx-auto bg-white shadow rounded-xl">
      <h2 className="mb-4 text-xl font-bold text-blue-900">계정 관리</h2>

      {/* 비밀번호 변경하기 */}
      <AccountPassword />
      
      {/* 탈퇴하기 */}
      <div className="pt-8 mt-12 border-t">
        <Withdraw />
      </div>
      
    </div>
  );
}