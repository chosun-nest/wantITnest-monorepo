{/* 학과 검색 + 선택 */}
export interface Item {
  id: number;
  name: string;
}
interface EditDepartmentProps {
  isEditing: boolean;
  departmentInput: string;
  onInputChange: (value: string) => void;
  filteredDepartments: { id: number; name: string }[];
  onSelect: (item: { id: number; name: string }) => void;
}

export default function EditDepartment({
  isEditing,
  departmentInput,
  onInputChange,
  filteredDepartments,
  onSelect,
}: EditDepartmentProps) {
  return (
    <div className="flex items-start mb-4">
      <label className="mt-2 text-sm font-semibold w-28">학과</label>
      <div className="flex-1">
        <input
          value={departmentInput}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={!isEditing}
          className="block w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
        />
        {isEditing && filteredDepartments.length > 0 && (
          <ul className="mt-1 overflow-y-auto border rounded max-h-40">
            {filteredDepartments.map((item) => (
              <li
                key={item.id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => onSelect(item)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}