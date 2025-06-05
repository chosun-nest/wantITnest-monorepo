// 프로필 수정 성공 컴포넌트
interface Props {
  onClose: () => void;
}

export default function ProfileEditCompleteModal({ onClose }: Props) {  
  const handleConfirm = () => {
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md text-center shadow-lg">
        <h3 className="mb-4 text-lg font-bold text-gray-800">프로필이 변경되었습니다</h3>
        <p className="mb-6 text-sm text-gray-600">프로필 카드를 확인해보세요!</p>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 text-white bg-blue-900 rounded hover:bg-blue-950"
        >
          확인
        </button>
      </div>
    </div>
  );
}