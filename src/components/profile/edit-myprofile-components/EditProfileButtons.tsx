{ /*저장/취소/설정 버튼 */ }
import React from "react";

interface Props {
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
  onEdit: () => void;
}

export default function EditProfileButtons({ isEditing, onCancel, onSave, onEdit }: Props) {
  return (
    <div className="text-right">
      {isEditing ? (
        <>
          <button onClick={onCancel} className="px-4 py-2 mr-2 rounded border">취소</button>
          <button onClick={onSave} className="px-4 py-2 bg-blue-500 text-white rounded">저장</button>
        </>
      ) : (
        <button onClick={onEdit} className="px-4 py-2 bg-blue-500 text-white rounded">설정</button>
      )}
    </div>
  );
}
