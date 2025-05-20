import React from "react";
import { Listbox } from "@headlessui/react"; //설치 필요 패키지 (한 번만) - npm install @headlessui/react lucide-react
import { ChevronDown, Check } from "lucide-react"; // 아이콘 없으면 제거해도 됨

interface Props {
  selected: string;
  onChange: (value: string) => void;
}

const categories = [
  "전체",
  "일반공지",
  "학사공지",
  "장학공지",
  "IT융합대학 공지",
  "컴퓨터공학과 공지",
];

export default function NoticeDropdown({ selected, onChange }: Props) {
  return (
    <div className="w-60 mb-4">
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          {/* 선택된 항목 표시 버튼 */}
          <Listbox.Button className="w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-4 pr-10 text-left text-sm font-medium text-gray-700 shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <span>{selected}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </span>
          </Listbox.Button>

          {/* 옵션 리스트 */}
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            {categories.map((category) => (
              <Listbox.Option
                key={category}
                value={category}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                      {category}
                    </span>
                    {selected && (
                      <span className="absolute left-2 top-2.5 text-blue-600">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
