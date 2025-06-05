// 저장/취소/설정 버튼
interface Props {
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
  onEdit: () => void;
}

export default function EditProfileButtons({ isEditing, onCancel, onSave, onEdit }: Props) {
  const handleSave = () => {
    onSave();                     // 저장 실행
  };

  return (
    <>
      <div className="text-right">
        {isEditing ? (
          <>
            <button onClick={onCancel} className="px-4 py-2 mr-2 border rounded">취소</button>
            <button onClick={handleSave} className="px-4 py-2 text-white bg-blue-900 rounded">저장</button>
          </>
        ) : (
          <button onClick={onEdit} className="px-4 py-2 text-white bg-blue-900 rounded">설정</button>
        )}
      </div>
    </>
  );
}
