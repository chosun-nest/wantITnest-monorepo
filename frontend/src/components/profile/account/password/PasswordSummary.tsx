// 비밀번호 변경 버튼 누르기 전, * 표시로 비밀번호 summary 나타내는 컴포넌트
interface Props {
  onEdit: () => void;
  passwordLength: number;
}

export default function PasswordSummary({ onEdit, passwordLength }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <label className="text-sm font-semibold w-36">비밀번호</label>
        <input
          type="password"
          value={"*".repeat(passwordLength)}
          disabled
          className="flex-1 p-2 text-lg tracking-widest bg-gray-100 rounded"
        />
      </div>
      <div className="text-right">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-white bg-blue-900 rounded"
        >
          설정
        </button>
      </div>
    </div>
  );
}
