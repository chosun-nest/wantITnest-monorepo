// 게시글 등록 버튼
interface Props {
  onCancel: () => void;
  onSubmit: () => void;
}

export default function SubmitButtons({ onCancel, onSubmit }: Props) {
  return (
    <div className="flex justify-end gap-2 mt-6">
      <button
        onClick={onCancel}
        className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100"
      >
        취소
      </button>
      <button
        onClick={onSubmit}
        className="px-5 py-2 text-white bg-[#002F6C] rounded hover:bg-[#001a47]"
      >
        등록
      </button>
    </div>
  );
}
