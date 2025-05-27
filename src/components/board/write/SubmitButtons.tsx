// 게시글 등록 버튼
interface Props {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export default function SubmitButtons({
  onCancel,
  onSubmit,
  submitLabel = "등록하기",
}: Props) {
  return (
    <div className="flex justify-end gap-2 mt-6">
      <button onClick={onCancel} className="px-4 py-2 border rounded">
        취소
      </button>
      <button
        onClick={onSubmit}
        className="px-5 py-2 text-white bg-[#002F6C] rounded hover:bg-[#001a47]"
      >
        {submitLabel}
      </button>
    </div>
  );
}
