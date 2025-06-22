import { useState } from "react";

interface RoleToggleBadgeProps {
  role: string;
  setRole: (newRole: string) => void;
}

// ✅ 이미 대문자로 정의된 역할 목록
const roles = ["PM", "FRONTEND", "BACKEND", "AI", "DESIGN", "ETC"];

export default function RoleToggleBadge({ role, setRole }: RoleToggleBadgeProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (selected: string) => {
    setRole(selected); // 변환 필요 없음
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* 선택된 역할 뱃지 + 드롭 버튼 */}
      <div className="flex items-center gap-1">
        <span className="px-2 py-1 bg-green-200 text-sm font-medium rounded">
          {role}
        </span>
        <button
          className="text-gray-600 text-xl font-bold"
          onClick={() => setOpen((prev) => !prev)}
        >
          ...
        </button>
      </div>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div className="absolute z-10 mt-2 w-28 rounded-md bg-white shadow-lg border">
          <ul className="py-1 text-sm text-gray-700">
            {roles.map((r) => (
              <li
                key={r}
                onClick={() => handleSelect(r)}
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
