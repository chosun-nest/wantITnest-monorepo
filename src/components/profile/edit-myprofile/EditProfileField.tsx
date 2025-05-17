// 이름/이메일 등 readonly 필드
interface Props {
  name: string;
  email: string;
}
  
export default function EditProfileField({ name, email }: Props) {
  const isChosunEmail = email.endsWith("@chosun.ac.kr") || email.endsWith("@chosun.kr");

  return (
    <>
      <div className="flex items-center mb-4">
        <label className="text-sm font-semibold w-28">이름</label>
        <input value={name} disabled className="flex-1 p-2 bg-gray-100 rounded" />
      </div>

      <div className="flex items-center mb-4">
        <label className="text-sm font-semibold w-28">이메일</label>
        <div className="flex items-center flex-1 gap-2">
          <input value={email} disabled className="w-full p-2 bg-gray-100 rounded" />
          {isChosunEmail && (
            <img
              src="/assets/images/verified-badge.png"
              alt="Verified"
              title="조선대 인증 이메일"
              className="w-6 h-6"
            />
          )}
        </div>
      </div>
    </>
  );
}