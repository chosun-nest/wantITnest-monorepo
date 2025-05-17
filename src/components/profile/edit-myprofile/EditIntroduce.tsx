// 한 줄 소개란
interface Props {
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
}

export default function EditIntroduce({ value, isEditing, onChange }: Props) {
  return (
    <div className="flex items-start mb-4">
      <label className="mt-2 text-sm font-semibold w-28">자기소개</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditing}
        className="flex-1 p-2 rounded border min-h-[80px] focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
      />
    </div>
  );
} 
