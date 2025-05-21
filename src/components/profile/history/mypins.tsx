// components/MyPin.tsx
import { FaStar } from "react-icons/fa";

export interface MyPinProps {
  title: string;
  items: { text: string; pinned?: boolean }[];
  editable?: boolean;
}

export default function MyPin({ title, items, editable }: MyPinProps) {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6 border border-gray-300 relative">
      <ul className="mb-4 space-y-1">
        <li className="font-semibold">{title}</li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 ml-4 text-gray-800">
            • {item.text}
            {item.pinned && <FaStar className="text-yellow-400" />}
          </li>
        ))}
      </ul>
      {editable && (
        <button className="absolute bottom-4 right-4 px-3 py-1 border border-gray-400 rounded text-sm hover:bg-gray-100">
          수정
        </button>
      )}
    </div>
  );
}
